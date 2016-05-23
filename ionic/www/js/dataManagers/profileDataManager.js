angular.module('profileDataManager', [])
.factory('profileDataManager', function($http,$cordovaSQLite,$q,databaseService) {
  return {
       getUserProfileFields: function(){
                var deferred = $q.defer();
                var db = databaseService.getConnectionObject();
                var query = "SELECT profile FROM AppContent";
                var profile =  $cordovaSQLite.execute(db, query).then(function(res) {
                        var len = res.rows.length;
                        for (var i=0; i<len; i++){
                           profile = JSON.parse(res.rows.item(i).profile);
                          }
                          return profile;
                          //resolve here
                          deferred.resolve(profile);
                      }, function (err) {
                    });
               deferred.resolve(profile);
               return deferred.promise;
          },

   getUserUpdateProfile : function(emailId){
           var deferred = $q.defer();
           var db = databaseService.getConnectionObject();
          if (emailId) {
            var query = "SELECT profileJson FROM user WHERE emailId ='"+emailId.trim()+"'";
            var profile =  $cordovaSQLite.execute(db, query).then(function(res) {
                      var len = res.rows.length;
                      for (var i=0; i<len; i++){
                       profile = JSON.parse(res.rows.item(i).profileJson);
                      }
                      return profile;
                  }, function (err) {
                });
             }
             deferred.resolve(profile);
             return deferred.promise;
      },
getUserSettingsJson : function(emailId){
        var deferred = $q.defer();
        var db = databaseService.getConnectionObject();
        if (emailId) {
         var query = "SELECT settingsJson FROM user WHERE emailId ='"+emailId.trim()+"'";
         var settings =  $cordovaSQLite.execute(db, query).then(function(res) {
                   var len = res.rows.length;
                   for (var i=0; i<len; i++){
                    settings = JSON.parse(res.rows.item(i).settingsJson);
                   }
                   return settings;
               }, function (err) {
             });
          }
          deferred.resolve(settings);
          return deferred.promise;
   },
  checkUserExistsByEmail : function(emailId){
           var deferred = $q.defer();
           var db = databaseService.getConnectionObject();
           var create = $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS User(id INTEGER PRIMARY KEY AUTOINCREMENT, createdDate TEXT, emailId TEXT,profileJson TEXT,settingsJson TEXT,updatedDate TEXT, userId TEXT,globalId TEXT)');
           var query = "SELECT userId FROM User WHERE emailId ='"+emailId+"'";
           var insert =  $cordovaSQLite.execute(db, query).then(function(res) {
                  if(res.rows.length > 0){
                    return true ;
                  }else {
                    return false ;
                    }
                 }, function (err) {
               });
           deferred.resolve(insert);
           return deferred.promise;
        },

   createNewUser : function(profile,emailId,authToken){
         var deferred = $q.defer();
         var profileJson = JSON.stringify(profile);
         var randomNumber=Math.ceil(Math.random()*100);
         var db = databaseService.getConnectionObject();
         var create = $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS User(id INTEGER PRIMARY KEY AUTOINCREMENT, createdDate TEXT, emailId TEXT,profileJson TEXT, settingsJson TEXT,updatedDate TEXT, userId TEXT,globalId TEXT)');
         var insert =  $cordovaSQLite.execute(db, 'INSERT INTO User (createdDate, emailId, profileJson, updatedDate, userId,globalId) VALUES (?,?,?,?,?,?)', [new Date(),emailId.trim(),profileJson,new Date(),randomNumber,authToken])
                          .then(function(res) {
                              return res.insertId ;
                          }, function (err) {
                      });
         deferred.resolve(insert);
         return deferred.promise;
      },
      updateUserByEmailId : function(profileJson,emailId){
            var deferred = $q.defer();
            var profileJson = JSON.stringify(profileJson);
            var db = databaseService.getConnectionObject();
            var query = "UPDATE User SET updatedDate = '"+new Date()+"', profileJson = '"+profileJson+"'  WHERE emailId = ?";
            var update =  $cordovaSQLite.execute(db, query , [emailId] )
                             .then(function(res) {
                                 return res.rowsAffected ;
                             }, function (err) {
                         });
            deferred.resolve(update);
            return deferred.promise;
         },
      updateUserAuthToken:function(emailId,token){
          var deferred = $q.defer();
          var db = databaseService.getConnectionObject();
          var query = "UPDATE User SET gardleId = '"+token+"' WHERE emailId = ?";
          var update =  $cordovaSQLite.execute(db, query , [emailId] )
                           .then(function(res) {
                               return res.rowsAffected ;
                           }, function (err) {
                       });
          deferred.resolve(update);
          return deferred.promise;
      },
      getUserIDByEmail : function(emailId){
            var deferred = $q.defer();
            var db = databaseService.getConnectionObject();
            var query = "SELECT userId FROM User WHERE emailId ='"+emailId.trim()+"'";
            var insert =  $cordovaSQLite.execute(db, query).then(function(res) {
                   if(res.rows.length > 0){
                     return res.rows.item(0).userId ;
                   }else {
                     return null ;
                     }
                  }, function (err) {
                });
            deferred.resolve(insert);
            return deferred.promise;
         },
   logInViaPasscode :  function(emailId,passcode){
        var deferred = $q.defer();
         var db = databaseService.getConnectionObject();
         var query = "SELECT id FROM Session WHERE emailId ='"+emailId.trim()+"' AND passcode ='"+passcode.trim()+"' ";
         var select =  $cordovaSQLite.execute(db, query).then(function(res) {
                if(res.rows.length > 0){
                  return res.rows ;
                }else {
                   return null ;
                 }
               }, function (err) {
             });
         deferred.resolve(select);
       return deferred.promise;
    },
   getEmailList : function(){
             var deferred = $q.defer();
             var db = databaseService.getConnectionObject();
             var query = "SELECT emailId FROM User";
             var insert =  $cordovaSQLite.execute(db, query).then(function(res) {
                    if(res.rows.length > 0){
                      return res.rows ;
                    }else {
                      return null ;
                    }
                   }, function (err) {
                 });
             deferred.resolve(insert);
             return deferred.promise;
      },
    addPasscodeToUserID : function (userId,passcode,email){
          var deferred = $q.defer();
          var db = databaseService.getConnectionObject();
          var create = $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Session(id INTEGER PRIMARY KEY AUTOINCREMENT, passcode TEXT, token TEXT,userId TEXT,emailId TEXT)');
          var insert =  $cordovaSQLite.execute(db, 'INSERT INTO Session (passcode, token, userId,emailId) VALUES (?,?,?,?)', [passcode,'',userId,email.trim()])
                           .then(function(res) {
                               return res.insertId ;
                           }, function (err) {
                          });
          deferred.resolve(insert);
          return deferred.promise;
        },
    updateSettingsJsonToUserID : function (emailId,settingsJson){
          var deferred = $q.defer();
          var settingsJson = JSON.stringify(settingsJson);
          var db = databaseService.getConnectionObject();
          var query = "UPDATE User SET updatedDate = '"+new Date()+"' , settingsJson = '"+settingsJson+"'  WHERE emailId = ?";
          var update =  $cordovaSQLite.execute(db, query , [emailId.trim()] )
                           .then(function(res) {
                               return res.rowsAffected ;
                           }, function (err) {
                       });
          deferred.resolve(update);
          return deferred.promise;
       },
   checkPasscodeExistsForUserID : function(userId,passcode){
         var deferred = $q.defer();
         var db = databaseService.getConnectionObject();
         var query = "SELECT id FROM Session WHERE userId ='"+userId+"' AND passcode ='"+passcode+"' ";
         var insert =  $cordovaSQLite.execute(db, query).then(function(res) {
                if(res.rows.length > 0){
                  return true ;
                }else {
                  return false ;
                 }
               }, function (err) {
             });
         deferred.resolve(insert);
         return deferred.promise;
    },
  updatePasscodeToUserID : function (userId,passcode){
             var deferred = $q.defer();
             var db = databaseService.getConnectionObject();
             //chek the email ID exists
             var query = "UPDATE Session SET passcode = '"+passcode+"' WHERE userId = ?";
             var update =  $cordovaSQLite.execute(db, query , [userId.trim()] )
                              .then(function(res) {
                                  return res.rowsAffected ;
                              }, function (err) {
                          });
             deferred.resolve(update);
             return deferred.promise;
      },
  checkUserExistsByEmailAndPasscode:function(email,passcode){
                 var deferred = $q.defer();
                 var db = databaseService.getConnectionObject();
                 //chek the email ID exists
                 var query = "SELECT userId FROM Session WHERE emailId ='"+email.trim()+"' AND passcode ='"+passcode.trim()+"' ";
                 var insert =  $cordovaSQLite.execute(db, query).then(function(res) {
                        if(res.rows.length > 0){
                          return res.rows.item(0).userId ;
                        }else {
                          return false ;
                        }
                       }, function (err) {
                     });
                 deferred.resolve(insert);
                 return deferred.promise;
      },
      checkUserExistsByEmailOnly:function(email){
                     var deferred = $q.defer();
                     var db = databaseService.getConnectionObject();
                     //chek the email ID exists
                     var query = "SELECT userId FROM User WHERE emailId ='"+email.trim()+"' ";
                     var insert =  $cordovaSQLite.execute(db, query).then(function(res) {
                            if(res.rows.length > 0){
                              return res.rows.item(0).userId ;
                            }else {
                              return false ;
                            }
                           }, function (err) {
                         });
                     deferred.resolve(insert);
                     return deferred.promise;
          }
    }
});
