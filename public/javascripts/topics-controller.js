/*
 * Copyright 2014 Claude Mamo
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

app.controller("TopicsController", function ($scope, $location, $http, $filter) {
    $http.get('topics.json').
        success(function (data) {
            $scope.topics = data;

            angular.forEach($scope.topics, function (topic) {
                angular.forEach(topic.partitions, function (partition) {
                    partition.id = parseInt(partition.id)
                });

                topic.partitions = $filter('orderObjectBy')(topic.partitions, 'id')
            });
        });

    $scope.ctopic = {};
    $scope.ctopic.partitions = 1;
    $scope.ctopic.replications = 1;
    $scope.groups = [
            {name:'All'},
            {name:'Development'},
            {name:'Production'},
            {name:'Staging'},
            {name:'Test'}];

    $scope.zookeepers = {};

    $scope.getTopic = function (topic) {
        $location.path('topics/' + topic.name + '/' + topic.zookeeper);
    };
    $scope.getZookeepers = function (group) {
        $http.get('/zookeepers.json/' + group).
            success(function (data) {
                $scope.zookeepers = data
            });
    };

    $scope.selectGroup = function () {
        $scope.getZookeepers($scope.ctopic.group.name)
    };

    $scope.createTopic = function (ctopic) {
        console.log(ctopic)
        $http.post('/topics.json', { name: ctopic.name, group: ctopic.group.name, zookeeper: ctopic.zookeeper.name, partitions: ctopic.partitions, replications: ctopic.replications}).success(function () {
            location.reload();
        });
    };

    $scope.removeTopic = function (topic) {
        $http.delete('/topics.json/' + topic.name + '/'+topic.zookeeper).success(function () {
            location.reload();
        });
    };
});
