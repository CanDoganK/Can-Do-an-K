package city.con.api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import me.clip.placeholderapi.PlaceholderAPI;
import org.bukkit.Bukkit;
import org.bukkit.OfflinePlayer;
import org.bukkit.configuration.ConfigurationSection;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

/**
 * ConCity mobil uygulaması için salt okunur HTTP API.
 *
 * GET /health          -> {"ok":true}
 * GET /news            -> config.yml'deki duyurular
 * GET /players/{uuid}  -> PlaceholderAPI ile okunan istatistikler, oyuncu yoksa 404
 */
public final class ConCityApiPlugin extends JavaPlugin {
    private HttpServer server;

    @Override
    public void onEnable() {
        saveDefaultConfig();
        String bind = getConfig().getString("http.bind", "0.0.0.0");
        int port = getConfig().getInt("http.port", 8085);
        try {
            server = HttpServer.create(new InetSocketAddress(bind, port), 0);
        } catch (IOException e) {
            getLogger().log(Level.SEVERE, "HTTP sunucusu başlatılamadı (port " + port + ")", e);
            getServer().getPluginManager().disablePlugin(this);
            return;
        }
        server.setExecutor(Executors.newFixedThreadPool(4));
        server.createContext("/", this::handle);
        server.start();
        getLogger().info("ConCityAPI " + bind + ":" + port + " adresinde çalışıyor.");
    }

    @Override
    public void onDisable() {
        if (server != null) server.stop(0);
    }

    private void handle(HttpExchange ex) throws IOException {
        try (ex) {
            if (!"GET".equals(ex.getRequestMethod())) {
                send(ex, 405, Map.of("error", "method_not_allowed"));
                return;
            }
            String path = ex.getRequestURI().getPath().replaceAll("/+$", "");
            if (path.equals("/health")) {
                send(ex, 200, Map.of("ok", true));
            } else if (path.equals("/news")) {
                send(ex, 200, news());
            } else if (path.startsWith("/players/")) {
                handlePlayer(ex, path.substring("/players/".length()));
            } else {
                send(ex, 404, Map.of("error", "not_found"));
            }
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "API isteği başarısız: " + ex.getRequestURI(), e);
            send(ex, 500, Map.of("error", "internal_error"));
        }
    }

    private void handlePlayer(HttpExchange ex, String rawId) throws Exception {
        UUID uuid;
        try {
            uuid = parseUuid(rawId);
        } catch (IllegalArgumentException e) {
            send(ex, 400, Map.of("error", "invalid_uuid"));
            return;
        }
        // Placeholder eklentilerinin çoğu ana thread'de çağrılmayı bekler.
        Map<String, Object> stats = Bukkit.getScheduler()
                .callSyncMethod(this, () -> readStats(Bukkit.getOfflinePlayer(uuid)))
                .get(5, TimeUnit.SECONDS);
        if (stats == null) {
            send(ex, 404, Map.of("error", "player_not_found"));
        } else {
            send(ex, 200, stats);
        }
    }

    /** Oyuncu sunucuya hiç girmediyse null döner. */
    private Map<String, Object> readStats(OfflinePlayer player) {
        if (!player.isOnline() && !player.hasPlayedBefore()) return null;
        Map<String, Object> stats = new LinkedHashMap<>();
        ConfigurationSection section = getConfig().getConfigurationSection("stats");
        boolean papi = getServer().getPluginManager().isPluginEnabled("PlaceholderAPI");
        if (section == null || !papi) return stats;
        for (String key : section.getKeys(false)) {
            String placeholder = section.getString(key, "");
            String value = PlaceholderAPI.setPlaceholders(player, placeholder).trim();
            // Çözülemeyen placeholder aynen geri döner; bunları atla.
            if (value.isEmpty() || value.equals(placeholder)) continue;
            stats.put(key, toNumberIfPossible(value));
        }
        return stats;
    }

    private List<Map<String, Object>> news() {
        List<Map<String, Object>> items = new ArrayList<>();
        for (Map<?, ?> raw : getConfig().getMapList("news")) {
            Map<String, Object> item = new LinkedHashMap<>();
            for (String key : List.of("id", "title", "summary", "body", "tag", "date")) {
                Object v = raw.get(key);
                if (v != null) item.put(key, v.toString().strip());
            }
            items.add(item);
        }
        return items;
    }

    private static UUID parseUuid(String raw) {
        String s = raw.replace("-", "");
        if (s.length() != 32) throw new IllegalArgumentException(raw);
        return UUID.fromString(s.replaceFirst(
                "(\\p{XDigit}{8})(\\p{XDigit}{4})(\\p{XDigit}{4})(\\p{XDigit}{4})(\\p{XDigit}{12})",
                "$1-$2-$3-$4-$5"));
    }

    /** "42" veya "12.5" gibi düz sayıları sayıya çevirir; biçimli değerler ("1.234,56") metin kalır. */
    private static Object toNumberIfPossible(String value) {
        if (value.matches("-?\\d{1,18}")) return Long.parseLong(value);
        if (value.matches("-?\\d+\\.\\d+")) return Double.parseDouble(value);
        return value;
    }

    private static void send(HttpExchange ex, int status, Object body) throws IOException {
        byte[] bytes = Json.write(body).getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = ex.getResponseBody()) {
            os.write(bytes);
        }
    }
}
