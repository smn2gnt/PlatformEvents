global class subscribeToPlatformEventsController {
    @AuraEnabled
    global static String getSessionId() {
        return UserInfo.getSessionId();
    }
    
    @AuraEnabled
    global static List<String> getAllPlatformEvents(){
        List<String> platformEvents = new List<String>();
        for(Schema.SObjectType obj : Schema.getGlobalDescribe().Values()){
            if(obj.getDescribe().getName().endsWith('__e')){
                platformEvents.add(obj.getDescribe().getName());
            }
        }
        system.debug(platformEvents);
        return platformEvents;
    }
}