package backend;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;


@Controller
public class GameController {
	
    @MessageMapping("/")
    @SendToUser("/queue/reply")  // Invia solo a chi ha fatto la domanda
    public String handeMessage(String message) {
        String response = "Hello, " + HtmlUtils.htmlEscape(message) + "!";
        return response;
    }
}
