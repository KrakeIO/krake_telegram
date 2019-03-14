var datasource_handle = "n5641_2a2f7f3739661f54efeecc4f95003f47eses";
var recipeUrl = "https://getdata.io/data-sources/n5641_2a2f7f3739661f54efeecc4f95003f47eses/definition";
var publishingUrl = "https://getdata.io/data-sources/n5641_2a2f7f3739661f54efeecc4f95003f47eses/publish";
var recipe;
var recordsHash = {}

console.log("processing data for " + datasource_handle);

var processBatch = function(){
  collectFetchedRecords().then(publishFetchedRecords);

}

var setRecipe = function() {
  console.log("\tSetting Recipe");    
  $.ajaxSetup({async:false});
  $.get(recipeUrl, function(results) {
    recipe = results;
  });  
};

var collectFetchedRecords = function() {
  console.log("\tFetching records from channel");    
  var deferred = jQuery.Deferred();
  var records = [];
  recipe.columns.forEach(function(column) {
    $(column["dom_query"]).each(function(index, dom) {
      var value = "";
      if(column.required_attribute) {
        value = $(dom).attr(column.required_attribute).trim();
        
      } else {
        value = $(dom).text().trim();
      }
      records[index] = records[index] || {};
      records[index][column["col_name"]] = value;
    });
  });

  records.forEach(function(record) {
    recordsHash[record["author"] + record["postedAt"]] = record;
  });

  deferred.resolve();
  return deferred.promise();  
}

var publishFetchedRecords = function() {
  var deferred = jQuery.Deferred();

  console.log("\tTotal records found" + Object.keys(recordsHash).length);    
  Object.keys(recordsHash).forEach(function(key, index) {
    console.log("\t\tpublishing record #" + index);
    record = recordsHash[key];
    console.log(record);
    $.ajax({
      async: false, 
      type: "POST",
      url: publishingUrl,
      data: {
        "record": record,
        "format": "json"
      }
    });    
  });

  deferred.resolve();
  return deferred.promise();

}

if(window.location.href.match("telegram")) {
  console.log("detected telegram website");
  setTimeout(function() {
    setRecipe();
    processBatch();    
  }, 10000);
}
