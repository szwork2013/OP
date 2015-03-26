(function() {
  var MessageRuleMappingCtrl;

  MessageRuleMappingCtrl = (function() {
    function MessageRuleMappingCtrl($modal, $rootScope, $http, $timeout, $log, $scope, $location, MessageRuleMappingService) {
      this.$modal = $modal;
      this.$rootScope = $rootScope;
      this.$http = $http;
      this.$timeout = $timeout;
      this.$log = $log;
      this.$scope = $scope;
      this.$location = $location;
      this.MessageRuleMappingService = MessageRuleMappingService;
      this.$log.debug("constructing MessageRuleMappingCtrl");
      this.$rootScope.constant = {
        activityScene: [],
        activityId: [],
        messageCode: []
      };
      this.$scope.pageSizes = [10, 20, 30];
      this.$scope.columnDefs = [
        {
          field: "methodName",
          displayName: "调用方法名"
        }, {
          field: "ruleCode",
          displayName: "规则编码"
        }, {
          field: "messageTypeDes",
          displayName: "推送类型"
        }, {
          field: "sceneDesc",
          displayName: "活动场景"
        }, {
          field: "activityDesc",
          displayName: "活动"
        }, {
          field: "status",
          displayName: "有效",
          cellTemplate: "<div class='ngCellText' ng-class='col.colIndex()'><span>{{row.entity.status== 'Y' ? '是' : '否'}}</span></div>"
        }, {
          field: "locked",
          displayName: "操作",
          cellTemplate: "views/messagemapping/messageMappingCell.html"
        }
      ];
      this.$scope.pageUrl = baseUrl+"/message/mappings";
      new PageService(this.$scope, this.$http, this.$timeout);
      this.$scope.addRule = (function(_this) {
        return function(row) {
          return _this.addRule(row);
        };
      })(this);
      this.$scope.editRow = (function(_this) {
        return function(row) {
          return _this.editRow(row);
        };
      })(this);
      this.$scope.openRule = (function(_this) {
        return function(isEditing) {
          var modalInstance;
          modalInstance = _this.$modal.open({
            templateUrl: "messagePushMappingModel.html",
            controller: "MessageRuleMappingAddCtrl",
            resolve: {
              selectedRow: function() {
                return _this.messagePushMapping;
              }
            }
          });
          return modalInstance.result.then((function(selectedItem) {
            return _this.$scope.selected = selectedItem;
          }), function() {
            return _this.$log.debug("Modal dismissed at: " + new Date());
          });
        };
      })(this);
    }

    MessageRuleMappingCtrl.prototype.addRule = function(row) {
      this.getActivityScene();
      this.getActivityIdByScene();
      this.messagePushMapping = {
        'status': 'Y'
      };
      return this.$scope.openRule(false);
    };

    MessageRuleMappingCtrl.prototype.editRow = function(row) {
      var value;
      this.$log.debug("editRow");
      this.editingRow = row;
      this.$log.debug(row);
      value = angular.toJson(row.entity);
      this.$log.debug(value);
      this.messagePushMapping = row;
      this.getActivityScene();
      this.getActivityIdByScene();
      return this.$scope.openRule(true);
    };

    MessageRuleMappingCtrl.prototype.delect = function(row) {
      this.$log.debug("delect()");
      return this.MessageRuleMappingService.delect(row).then((function(_this) {
        return function(data) {
          _this.$log.debug("delect MessagePushMapping successfully");
          return window.parent.location.reload();
        };
      })(this), (function(_this) {
        return function(error) {
          _this.$log.error("Unable to delect MessagePushMapping successfully: " + error);
          return _this.error = error;
        };
      })(this));
    };

    MessageRuleMappingCtrl.prototype.getActivityScene = function() {
      return this.MessageRuleMappingService.getActivityScene().then((function(_this) {
        return function(data) {
          _this.$log.debug(data);
          _this.$rootScope.constant.activityScene = data;
          return _this.$log.info("Successfully find messpushconfigidData:" + data);
        };
      })(this), (function(_this) {
        return function(error) {
          _this.$log.error("Unable to get messpushconfigid: " + error);
          return _this.error = error;
        };
      })(this));
    };

    MessageRuleMappingCtrl.prototype.getActivityIdByScene = function() {
      return this.MessageRuleMappingService.getActivityId('').then((function(_this) {
        return function(data) {
          _this.$log.debug(data);
          return _this.$rootScope.constant.activityId = data;
        };
      })(this), (function(_this) {
        return function(error) {
          _this.$log.error("Unable to get activityId: " + error);
          return _this.error = error;
        };
      })(this));
    };

    return MessageRuleMappingCtrl;

  })();

  angular.module("sbAdminApp").controller('MessageRuleMappingCtrl', MessageRuleMappingCtrl);

  angular.module("sbAdminApp").controller("MessageRuleMappingAddCtrl", function($rootScope, $scope, $log, $location, $modalInstance, selectedRow, MessageRuleMappingService) {
    $scope.dict = angular.fromJson(selectedRow);
    $scope.getActivityIdByScene = (function(_this) {
      return function(scene) {
        return MessageRuleMappingService.getActivityId(scene).then(function(data) {
          $log.debug(data);
          $log.info("Successfully find activitybyscene:" + data);
          return $rootScope.constant.activityId = data;
        }, function(error) {
          $log.error("Unable to get messpushconfigid: " + error);
          return error = error;
        });
      };
    })(this);
    $scope.ok = function() {
      MessageRuleMappingService.saveMsgPushMapping($scope.dict);
      $modalInstance.close($scope.dict);
      return window.parent.location.reload();
    };
    return $scope.cancel = function() {
      return $modalInstance.dismiss("cancel");
    };
  });

}).call(this);

