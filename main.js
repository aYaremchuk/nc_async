const request = require('request');
const readline = require('readline-sync');


const gitHubOrgName = readline.question('Type here GitHub organization name: ');

const optionsObj = {
  uri: '',
  headers: { 'User-Agent': 'Request-Promise' },
  json: true,
};

Object.defineProperty(optionsObj, 'url', {
  set(value) {
    this.url = value;
  },
});

optionsObj.uri = `https://api.github.com/orgs/${gitHubOrgName}/repos`;

function getRepos(options) {
  return new Promise(((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body.slice(0, 3).map(repo => repo.name));
      }
    });
  }));
}

function getContributorsForRepo(options, repoName) {
  options.uri = `https://api.github.com/repos/${gitHubOrgName}/${repoName}/contributors`;
  return new Promise(((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body.map(contributor => contributor.login));
      }
    });
  }));
}

function getContributors() {
  const resultObj = {};

  getRepos(optionsObj)
    .then((result) => {
      result.forEach((item, i, arr) => {
        getContributorsForRepo(optionsObj, item)
          .then((contributorsArray) => {
            resultObj[item] = contributorsArray;
            console.log(resultObj);
          });
      });
    })
    .catch((err) => {
      console.log('API call failed');
    });
}

getContributors(gitHubOrgName);
