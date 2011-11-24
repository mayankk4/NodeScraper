var http = require('http'),
           url = require('url'),
           path = require('path'),
           fs = require('fs'),
           request = require('request'),
           sys = require("sys")
           jsdom = require("jsdom");



var score_buffer = "empty";
refreshScoreBuffer();

function refreshScoreBuffer(){
    console.log("Refreshing score buffer....");
    
    request({ uri:'http://www.espncricinfo.com//ci/engine/current/match/scores/liveframe_realtime.html' },
                function (error, response, body) {
                    
                    if (error && res.statusCode !== 200) {
                      console.log('Error when contacting espncricinfo.com')
                    }

var jsdom = require('jsdom').jsdom,
    sys = require('sys'),
    window = jsdom().createWindow();

// jsdom.jQueryify(window, '/path/to/jquery.js', function (window, jquery) {
//   window.jQuery('body').append("<div class='testing'>Hello World</div>");
//   sys.puts(window.jQuery(".testing").text()); // outputs Hello World
// });


                    jsdom.env({ html: body,
                                scripts: ['http://code.jquery.com/jquery-1.5.min.js'],
                                done: function (err, window) {
      
                                        var $ = window.jQuery;
                                        // jQuery is now loaded on the jsdom window created from 'agent.body'
                
                                        var match = [];                                  
                                        var score = [];
                                        
                                        var all_matches = [];
                                        
                                        all_matches = $('a.potMatchLink').text().split('\n');
                                        
                                        count_matches = 0;
                                        $.each(all_matches, function(index, element) {
                                            
                                                if(element.trim() != "" && element.trim != null){
                                                   match[count_matches] = element.trim();
                                                   count_matches++;
                                                   }   
                                          });

                                        
                                        // Problem with jQuery in scraping SVG DOM classes.
                                        var all_scores =[];
                                        all_scores = $('*[class~="potMatchText mat_scores"]');
                                                                                
                                        for(var i=0; i< all_scores.length; i++){
                                            score[i] = $('*[class~="potMatchText mat_scores"]').first().text();
                                            $('*[class~="potMatchText mat_scores"]').first().remove();        
                                        }
                                        
                                        
                                        // console.log("TTTTT" + $('*[class~="potMatchText mat_scores"]').first().text());

                                        
                                        //console.log("UUUUUU" + score[0]);
                                        
                                        var output ="";
                                        for(var i=0; i < count_matches ; i++)
                                        {
                                            score[i] = (score[i] == "" ? "Match not started" : score[i]);
                                            output = output + "Match : " + match[i] + "\nScore : " + score[i] + "\n\n";                    
                                         }   
                                        
                                        // console.log("match = " + match.first().text().trim() + "\nscore = " + score.first().html() );
                                        score_buffer = output;
                                        
                                        console.log("Score Buffer Refreshed.");
                                    }  
                                });
                    });

}

setInterval(function(){
    refreshScoreBuffer();
    },(60000));
// 1000*60


http.createServer(function(req, res) {
// can use multiple response.write since connection is persistent (not the case in google app engine version)
    //console.log("Serving requests....");
    res.writeHead(200, {"Content-Type":"text/plain"});

    var urlObj = url.parse(req.url, true);
//    response.write("txtWeb Message : " + urlObj.query["txtweb-message"] + "\n" +
//                   "txtWeb Mobile : " + urlObj.query["txtweb-mobile"] + "\n");
    
    res.write("matches running are : \n" + score_buffer) ; 
    res.end();
    
}).listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
