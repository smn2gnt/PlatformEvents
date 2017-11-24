({
  connectCometd : function(component) {
    var helper = this;

    // Configure CometD
    var cometdUrl = window.location.protocol+'//'+window.location.hostname+'/cometd/41.0/';
    var cometd = component.get('v.cometd');
      console.log(component.get('v.sessionId'));
    cometd.configure({
      url: cometdUrl,
      requestHeaders: { Authorization: 'OAuth '+ component.get('v.sessionId')},
      appendMessageTypeToURL : false
    });
    cometd.websocketEnabled = false;
	console.log('test');
    // Establish CometD connection
    console.log('Connecting to CometD: '+ cometdUrl);
    cometd.handshake(function(handshakeReply) {
      if (handshakeReply.successful) {
          console.log('Connected to CometD.');
          component.set('v.cometdconfig', cometd);
          component.set('v.msg', 'Connected to CometD');
          /*var newSubscription = cometd.subscribe('/event/Notification__e' ,
          function(platformEvent) {
            console.log('Platform event received: '+ JSON.stringify(platformEvent));
            helper.onReceiveNotification(component, platformEvent);
          }
        );*/
        // Save subscription for later
        //var subscriptions = component.get('v.cometdSubscriptions');
        //subscriptions.push(newSubscription);
        //component.set('v.cometdSubscriptions', subscriptions);
        
      }
      else
        console.error('Failed to connected to CometD.');
    	});
      },
    
    connectToEvent: function(component, cometd){
        var helper = this;
        console.log(component.find('pEvent'));
        //+ component.find('pEvent').get('v.value')
        var newSubscription = cometd.subscribe('/event/'+ component.get('v.SelectedPE'),
          function(platformEvent) {
            console.log('Platform event received: '+ JSON.stringify(platformEvent));
            helper.onReceiveNotification(component, platformEvent);
          }
        );
        // Save subscription for later
        component.set('v.msg', 'Subscribed to ' + component.get('v.SelectedPE'));
        var subscriptions = component.get('v.cometdSubscriptions');
        subscriptions.push(newSubscription);
        component.set('v.cometdSubscriptions', subscriptions);
        component.set('v.cometdconfig', cometd);
    },

  disconnectCometd : function(component) {
    var cometd = component.get('v.cometdconfig');

    // Unsuscribe all CometD subscriptions
    cometd.batch(function() {
      var subscriptions = component.get('v.cometdSubscriptions');
        if(subscriptions !== null){
            subscriptions.forEach(function (subscription) {
            cometd.unsubscribe(subscription);
     	 });
        }
    });
    component.set('v.cometdSubscriptions', []);
    // Disconnect CometD
  },

  onReceiveNotification : function(component, platformEvent) {
    var helper = this;
    // Extract notification from platform event
    var newNotification = {
      time : $A.localizationService.formatDateTime(
        platformEvent.data.payload.CreatedDate, 'HH:mm'),
      message : platformEvent.data.payload
    };
    var payloads = component.get('v.payload');
    var pl = platformEvent.data.payload;
      payloads.push(Object.values(pl));
    component.set('v.payload', payloads);
    component.set('v.payloadKeys', Object.keys(pl));
    console.log(payloads);
    // Save notification in history
    var notifications = component.get('v.notifications');
    notifications.push(newNotification);
    component.set('v.notifications', notifications);
    // Display notification in a toast if not muted
    if (!component.get('v.isMuted'))
      helper.displayToast(component, 'info', newNotification.message);
  },

  displayToast : function(component, type, message) {
    var toastEvent = $A.get('e.force:showToast');
    toastEvent.setParams({
      type: type,
      message: message
    });
    toastEvent.fire();
  }
})