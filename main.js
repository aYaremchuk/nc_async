var request = require('request');
var readline = require('readline-sync');


var gitHubOrgName = readline.question("Type here GitHub organization name: ");

var optionsObj = {
    uri: '',
    headers: {'User-Agent': 'Request-Promise' },
    json: true
};

Object.defineProperty(optionsObj, 'url', {
    set: function(value) {
        this.url = value;
    }
});

optionsObj.uri = 'https://api.github.com/orgs/' + gitHubOrgName + '/repos';

function getRepos(options) {
    return new Promise(function(resolve, reject) {
        request(options, function(error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body.slice(0, 3).map(function(repo) { return repo.name; }));
            }
        });
    })
}

function getContributorsForRepo(options, repoName) {
    options.uri = 'https://api.github.com/repos/'+ gitHubOrgName + '/' + repoName +'/contributors';
    return new Promise(function(resolve, reject) {

        request(options, function(error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body.map(function(contributor) { return contributor.login; }));
            }
        });
    })
}

function getContributors(gitHubOrgName) {
    var resultObj = {};

    getRepos(optionsObj)
        .then(function(result) {
            result.forEach(function (item, i, arr) {
               getContributorsForRepo(optionsObj, item)
                   .then(function(contributorsArray) {
                       resultObj[item] = contributorsArray;
                       console.log(resultObj);
                   })
            });
        }
    )
    .catch(function (err) {
        console.log('API call failed');
    });
}

getContributors(gitHubOrgName);
