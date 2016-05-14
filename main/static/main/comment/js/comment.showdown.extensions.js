(function (extension) {
  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }
}(function (showdown) {
  // loading extension into shodown
  showdown.extension('reddit', function () {

    /////////////////////////////////

    var userLink = {
        type:    'lang',
        regex:   /([\w\.]*)(\/u\/\w+)/g,
        replace: function(match, start, username) {
            if(!start) {
                return '<a href="http://reddit.com' + username + '">' + username + '</a>';
            }
            else {
                return match
            }
        }
    }

    var subredditLink = {
        type:    'lang', 
        regex:   /([\w\.]*)(\/r\/\w+\/?)(?!\w|\b|$)/g,
        replace: function(match, start, subreddit, end) {
            if(!start) {
                return '<a href="http://reddit.com' + subreddit + '">' + subreddit + '</a>';
            } else {
                return match;
            }
            
        }
    }


    return [userLink, subredditLink];
    
  });
}));