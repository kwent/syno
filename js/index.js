var parameters_editor;
var response_editor;

var Syno = require('syno.Syno');
    
var app = angular.module("SynoModule", []);

app.factory("SynoRequestFactory", function() {
  
  return {
    request: function(protocol, host, username, password, port, api_name, method_name, method_params, callback) {
      
      var syno = new Syno({
          // Requests protocol
          protocol: protocol || 'https',
          // DSM host : ip, domain name
          host: host || 'demo.synology.com',
          // DSM port : port number
          port: port || '5001',
          // DSM User account (required)
          account: username || 'admin',
          // DSM User password (required)
          passwd: password || 'synology'
      });
      
      console.log('protocol', protocol);
      console.log('host', host);
      console.log('port', port);
      console.log('username', username);
      console.log('password', password);
      
      console.log('api_name', api_name);
      console.log('method_name', method_name);
      console.log('method_params', method_params);
      
      syno[api_name][method_name](JSON.parse(method_params), function(err, data) {
        callback(err, data);
      });
      
    }
  }
});

app.controller('SynoController', function($scope, SynoRequestFactory) {

    //Default values
    $scope.syno_protocol = ["http","https"];
    $scope.syno_protocol_selected = $scope.syno_protocol[1];
    $scope.syno_host = 'demo.synology.com';
    $scope.syno_username = 'admin';
    $scope.syno_password = 'synology';
    $scope.syno_port = 5001;
    $scope.syno_api_name = [ {'name':'FileStation | fs', 'value':'fs'} , {'name':'DownloadStation | dl', 'value':'dl'} ];
    $scope.syno_api_name_selected = 'fs';
    $scope.syno_response_success = false;
    $scope.syno_button_submit = "Request"
    
    $scope.$watch("syno_api_name_selected", function(newValue, oldValue) {
        SynoRequestFactory.request(null, null, null, null, null, newValue, "getMethods", null, function(response) {
          $scope.method_name_options = response;
          $scope.syno_method_name_selected = $scope.method_name_options[0];
        });
      });
    
    $scope.request = function() {
      $scope.syno_button_submit = 'Loading...';
      $scope.syno_response_success = false;
      SynoRequestFactory.request($scope.syno_protocol_selected, $scope.syno_host, $scope.syno_username, $scope.syno_password, $scope.syno_port, $scope.syno_api_name_selected, $scope.syno_method_name_selected, parameters_editor.getValue(), function(err, data) {
        
        if(err)
        {
          response_editor.setValue(err);
          $scope.$apply(function(){
            $scope.syno_button_submit = 'Request';
            $scope.syno_response_success = false;
          });
        }
        else
        {
          response_editor.setValue(JSON.stringify(data, undefined, 2));
          $scope.$apply(function(){
            $scope.syno_button_submit = 'Request';
            $scope.syno_response_success = true;
          });
        }
      });
    };
    
});

document.onreadystatechange = function () {
  parameters_editor = ace.edit("parameters_editor");
  parameters_editor.setTheme("ace/theme/chrome");
  parameters_editor.getSession().setMode("ace/mode/json");
  
  response_editor = ace.edit("response_editor");
  response_editor.setTheme("ace/theme/chrome");
  response_editor.setReadOnly(true);
  response_editor.setHighlightActiveLine(false);
  response_editor.getSession().setMode("ace/mode/json");
}