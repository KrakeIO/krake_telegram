
var Application = {}

Application.hibernateForNow = function() {
  setTimeout(function() {
    Application.rotateToNextURL();
  }, 360000);  
}

Application.rotateToNextURL = function() {

  Application.fetchCurrentTab(function(tab) {
    var current_url = Application.fetchNextUrlInList();
    console.log("rotating to next URL: " + current_url);
    chrome.tabs.update(tab.id, {url: current_url});
    Application.hibernateForNow();

  })
}

Application.fetchCurrentTab = function(callback) {
  chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    callback(tab);
  });    

}

Application.fetchNextUrlInList = function() {
  var current_url = Application.listOfUrls[Application.currentUrlIndex];

  Application.currentUrlIndex += 1;
  Application.currentUrlIndex %= Application.listOfUrls.length;
  return current_url;

}

Application.listOfUrls = [
  "https://web.telegram.org/#/im?p=@ethereumdapps",
  "https://web.telegram.org/#/im?p=@BitcoinTradingUS",
  "https://web.telegram.org/#/im?p=@EthereumLimited",
  "https://web.telegram.org/#/im?p=@etherlinkcommunity",
  "https://web.telegram.org/#/im?p=@regium_chat",
  "https://web.telegram.org/#/im?p=@bitcoinsignalsfree",
  "https://web.telegram.org/#/im?p=@BitcoinBravado",
  "https://web.telegram.org/#/im?p=@Ethereum_Hourly_bot",
  "https://web.telegram.org/#/im?p=@bitcoin_experts"
];

Application.currentUrlIndex = 0;
Application.rotateToNextURL();