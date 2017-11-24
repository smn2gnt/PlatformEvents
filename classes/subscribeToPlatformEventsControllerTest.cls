@isTest
public class subscribeToPlatformEventsControllerTest {
    static testMethod void testsubscribeToPlatformEventsController(){
		string sessionid = subscribeToPlatformEventsController.getSessionId();
    	List<string> pEvents = subscribeToPlatformEventsController.getAllPlatformEvents();        
    }
}