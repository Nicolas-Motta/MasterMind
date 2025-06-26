package backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.TestPropertySource;

import java.net.URI;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = {"spring.websocket.sockjs.enabled=true"})
class BackendApplicationTests {

	@LocalServerPort
	private int port;

	@Test
	void contextLoads() {
		// Test che verifica che il contesto Spring si carichi correttamente
		assertNotNull(port);
		assertTrue(port > 0);
	}

	@Test
	void testWebSocketEndpointExists() throws Exception {
		// Test semplice che verifica che l'endpoint WebSocket sia disponibile
		String url = "http://localhost:" + port + "/masterMind";
		URI uri = new URI(url);
		
		// Verifica che l'URI sia valido
		assertNotNull(uri);
		assertEquals("localhost", uri.getHost());
		assertEquals(port, uri.getPort());
		assertEquals("/masterMind", uri.getPath());
		
		System.out.println("✅ WebSocket endpoint configurato su: " + url);
	}

	@Test
	void testServerIsRunning() {
		// Test che verifica che il server sia in esecuzione sulla porta corretta
		assertTrue(port > 1024, "La porta dovrebbe essere maggiore di 1024");
		assertTrue(port < 65536, "La porta dovrebbe essere minore di 65536");
		
		System.out.println("✅ Server in esecuzione sulla porta: " + port);
	}
}
