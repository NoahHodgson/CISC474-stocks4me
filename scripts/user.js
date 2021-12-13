const fs = require('fs');
const https = require('https');

module.exports = {createUser, getUserInfo, updateUserInfo};

function createUser(username, password) {
	return new Promise(resolve => {
		fs.readFile("testUserInfo.json", function(error, data) {
			if(error) {
				resolve(error);
			}
			
			var userData = (JSON.parse(data.toString()));
			
			if(userData["users"][username] != undefined) {
				resolve({"error":{"code":403,"message":"username taken"}});
			}
			
			var newUserData = {
				"username": username,
				"password": password,
				"wallet": 0,
				"stocks": {},
				"news": [],
				"pfp": "/img/pfpPlaceholder.svg",
				"showTutorial": 1
			}
			
			userData["users"][username] = newUserData;
			
			fs.writeFile("testUserInfo.json", JSON.stringify(userData), function(error) {
				if(error) {
					resolve(error);
				}
				resolve(JSON.stringify({
					"code":200
				}));
			});
			
		})
	});
}
function updateUserInfo(username, data) {
	return new Promise(resolve => {
		fs.readFile("testUserInfo.json", function(error, fileData) {
			if(error) {
				resolve(error);
			}
			console.log(data);
			var userData = (JSON.parse(fileData.toString()));
			if(userData["users"][username] == undefined) {
				resolve({"error":{"code":404,"message":"user not found"}});
				return;
			}
			
			var password = userData["users"][username]["password"]
			
			userData["users"][username] = data;
			userData["users"][username]["password"] = password;
			
			fs.writeFile("testUserInfo.json", JSON.stringify(userData), function(error) {
				if(error) {
					resolve({
						"error": {
							"code":"500",
							"message": error
						}
					})
					return;
				}
				resolve({
					"code":"200"
				})
			})
		})
	});
}

function getUserInfo(username, password) {
	return new Promise(resolve => {
		fs.readFile("testUserInfo.json", function(error, data) {
			if(error) {
				resolve(error);
			}
			var userData = (JSON.parse(data.toString())["users"]);
			
			if(userData[username] == undefined) {
				resolve({"error":{"code":404,"message":"user not found"}});
				return;
			}
			
			var userDataForUsername = userData[username];
			
			if(password == userDataForUsername["password"]) {
				delete userDataForUsername["password"];
				resolve({
					"code":200,
					"userData":userDataForUsername
				});
				return;
			} else {
				resolve({
					"error": {
						"code":403,
						"message":"password doesn't match"
					}
				});
				return;
			}
		})
	});
}