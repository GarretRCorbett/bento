(function($) {
  Drupal.behaviors.bento = {};
  Drupal.behaviors.bento.attach = function(context) {
    //  MUST WAIT FOR THE ENTIRE PAGE TO LOAD IN ORDER FOR
    //  GOOGLE CUSTOM SEARCH TO WORK IN INTERNET EXPLORER


    $(window).load(function() {             // deprecated in jQuery 1.8

      // SET TO 1 FOR LIVE SYSTEM
      // SET TO 2 FOR TEST SYSTEM

      var SYSTEM = 1;
      var systemPointer = (SYSTEM === 1) ? '' : '/d7_mainsite';
      console.log('514');

      var searchTerms, searchOption;
      // Determine if a search term has been provided as part of the path.
      var pathname = window.location.pathname;
      var pathparts = pathname.split("/");
      var parts = pathparts.length;
      var j = 0;
      searchTerms = '';

      // Special handling for when a slash is part of the search terms.

      var terms_part = (SYSTEM === 1) ? 1 : 2;
      while (j < parts) {
        if (j > terms_part) {
          searchTerms += pathparts[j];
          if (j < (parts - 1)) {
            searchTerms += '/';
          }
        }
        j++;
      }

      //console.log('searchTerms=' + searchTerms);

      if (searchTerms) {
        searchTerms = searchTerms.split("%20").join(" ");
        searchTerms = searchTerms.replace(/%22/g, '"');
        searchTerms = searchTerms.replace(/%27/g, "'");
      }

      // If the user has entered a search term, put it in the search text box.
      if (searchTerms) {
        $('#bento-search').val(searchTerms);
      }

      // Show and hide the appropriate parts of the page.
      resetPage(searchTerms, systemPointer);
      if ($("#formatdropdown").val() === 'summon') {
        $("#bento-article-options").addClass("bento-shown");
        $("#bento-article-options").removeClass("bento-hidden");
      }
      else if ($("#formatdropdown").val() === 'catalog') {
        $("#bento-catalog-options").addClass("bento-shown");
        $("#bento-catalog-options").removeClass("bento-hidden");
      }

      // The select box option has been changed.
      $("#formatdropdown").change(function() {
        var opt = "";
        $( "select option:selected" ).each(function() {
          opt += $( this ).val();
        });
        switch(opt) {
          case "all":
          $("#bento-article-options").addClass("bento-hidden");
          $("#bento-article-options").removeClass("bento-shown");
          $("#bento-catalog-options").addClass("bento-hidden");
          $("#bento-catalog-options").removeClass("bento-shown");
          break;
          case "summon":
          $("#bento-article-options").addClass("bento-shown");
          $("#bento-article-options").removeClass("bento-hidden");
          $("#bento-catalog-options").addClass("bento-hidden");
          $("#bento-catalog-options").removeClass("bento-shown");
          break;
          case "books":
          $("#bento-article-options").addClass("bento-hidden");
          $("#bento-article-options").removeClass("bento-shown");
          $("#bento-catalog-options").addClass("bento-hidden");
          $("#bento-catalog-options").removeClass("bento-shown");
          break;
          case "journals":
          $("#bento-article-options").addClass("bento-hidden");
          $("#bento-article-options").removeClass("bento-shown");
          $("#bento-catalog-options").addClass("bento-hidden");
          $("#bento-catalog-options").removeClass("bento-shown");
          break;
          case "catalog":
          $("#bento-article-options").addClass("bento-hidden");
          $("#bento-article-options").removeClass("bento-shown");
          $("#bento-catalog-options").addClass("bento-shown");
          $("#bento-catalog-options").removeClass("bento-hidden");
          break;
        }
      })

      // The search input box receives focus.  Clear the default value.
      $("#bento-search").focus(function() {
        //console.log('FOCUS');
        //var searchBoxContents = $("#bento-search").val();
        //console.log(searchBoxContents);
        //$("#bento-search").val("");
        var searchTermsBox = $(this).val();
        if (searchTermsBox === 'Search for articles, books, videos, journals and more') {
          $(this).val('');
        }
      });

      // The search button has been clicked
      var logUrl = systemPointer + '/bento_log_query';
      $("#bento-search-button").click(function() {
        console.log('bento log query call');
        searchOption = $("#formatdropdown").val();
        searchTerms = $("#bento-search").val();
        /*
        $.ajax({
          type: 'POST',
          url: logUrl,
          dataType: 'json',
          data: {'searchTerms': searchTerms, 'searchOption': searchOption},
          success: function(response) {
            //console.log('success');
            //console.log(response);
          },
          error: function(response) {
            //console.log('success');
            //console.log(response);
          },
        });
        */
        if (searchOption === 'all') {
          window.location.href = systemPointer + '/search_randall/' + searchTerms;
        }
        else if (searchOption === 'summon') {
          if (document.getElementById('article-option').checked) {
            window.location.href = 'http://uncw.summon.serialssolutions.com/#!/search?ho=t&fvf=ContentType,Journal%20Article,f%7CContentType,Trade%20Publication%20Article,f%7CContentType,Magazine%20Article,f%7CIsFullText,true,f&l=en&q=' + searchTerms;
          } else {
            window.location.href = 'http://uncw.summon.serialssolutions.com/#!/search?ho=t&fvf=ContentType,Journal%20Article,f%7CContentType,Trade%20Publication%20Article,f%7CContentType,Magazine%20Article,f&l=en&q=' + searchTerms;
          }
        }
        else if (searchOption === 'books') {
          window.location.href = 'http://libcat.uncw.edu/search/X?SEARCH=(' + searchTerms + ')&searchscope=4&SORT=D&m=a&m=c&m=h&b=wg&b=wj&b=wr&b=wf&b=wh&b=wb&b=wc&b=we&b=wi&b=wl&b=wn&b=ws&b=wu&b=wv&b=eb';
        }
        else if (searchOption === 'journals') {
          window.location.href = 'http://libcat.uncw.edu/search/?searchtype=j&searcharg=' + searchTerms;
        }
        else if (searchOption === 'catalog') {
          var encodedSearchTerms = encodeURIComponent(searchTerms);
          var searchType;
          if (document.getElementById('catalog-keyword').checked) {
            searchType = 'X';
          }
          else if (document.getElementById('catalog-title').checked) {
            searchType = 't';
          }
          else if (document.getElementById('catalog-author').checked) {
            searchType = 'a';
          }
          else if (document.getElementById('catalog-journal').checked) {
            searchType = 'j';
          }
          else {
            searchType = 'X';
          }
          window.location.href = 'http://libcat.uncw.edu/search/?searchtype=' + searchType + '&SORT=D&searcharg=' + encodedSearchTerms + '&searchscope=4';
        }
        return false;
      });

      // Google custom search
      function gcseCallback() {

        if (document.readyState === 'complete') {
          // Document is ready when CSE element is initialized.
          // Render an element with both search box and search results in div with id 'test'.
          google.search.cse.element.render({
            gname: 'gsearch',
            div: 'google-search',
            tag: 'searchresults-only',
            attributes: {
              resultSetSize: 5,
              noResultsString: 'No results found.'
            }});
            var element = google.search.cse.element.getElement('gsearch');
            element.execute('"' + searchTerms + '"');
          } else {
            // Document is not ready yet, when CSE element is initialized.
            google.setOnLoadCallback(function() {
              // Render an element with both search box and search results in div with id 'test'.
              google.search.cse.element.render({
                gname: 'gsearch',
                div: 'google-search',
                tag: 'searchresults-only',
                attributes: {
                  resultSetSize: 5,
                  noResultsString: 'No results found.'
                }});
                var element = google.search.cse.element.getElement('gsearch');
                element.execute('"' + searchTerms + '"');
              }, true);
            }
          }

          // Insert it before the CSE code snippet so that cse.js can take the script
          // parameters, like parsetags, callbacks.
          window.__gcse = {
            parsetags: 'explicit',
            callback: gcseCallback
          };
          (function() {
            var cx = '005978018638547358306:xrqdgqxe2na'; // Insert your own Custom Search engine ID here
            var gcse = document.createElement('script');
            gcse.type = 'text/javascript';
            gcse.async = true;
            gcse.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
            '//www.google.com/cse/cse.js?cx=' + cx;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gcse, s);
          })();
          // end Google custom search
        });  // end window load

        // Script functions.

        // Show and hide the appropriate parts of the page.
        var resetPage = (function(searchTerms, systemPointer) {
          var loading = '<img src="' + systemPointer + '/sites/all/modules/bento/images/loading.gif"/>';
          $("#bento-links").addClass("bento-hidden");
          $("#bento-help-links").addClass("bento-hidden");
          $("#bento-instructions").removeClass("bento-shown");
          $("#bento-results").hide();
          if (searchTerms) {
            // Hide instructions.
            $('#bento-instructions').hide();
            // Hide the 'See All' links and images.
            $(".bento-results-footer a").each(function() {
              $(this).hide();
            });
            $(".bento-results-footer img").each(function() {
              $(this).hide();
            });
            // Display the waiting spinner for dynamic categories
            $(".bento-dynamic").each(function() {
              $(this).html(loading);
            });
            // Update links based on search terms.
            $("#bento-results-other-searches a.digi").attr("href", "http://digitalcollections.uncw.edu/cdm/search/searchterm/" + searchTerms + "/order/nosort");
            $("#bento-results-other-searches a.govt").attr("href", "http://libcat.uncw.edu/search/X?SEARCH=(" + searchTerms + ")&searchscope=4&SORT=D&b=wd");
            $("#bento-results-other-searches a.beyd").attr("href", "http://www.worldcat.org/search?qt=worldcat_org_all&q=" + searchTerms);
            // Show the search results.
            $("#bento-results").show();
            $("#bento-links").addClass("bento-shown");
            $("#bento-links").removeClass("bento-hidden");
            $("#bento-help-links").addClass("bento-shown");
            $("#bento-help-links").removeClass("bento-hidden");
            search(searchTerms, systemPointer);
          }

        });

        // Ajax calls to the various php search functions.
          var search = (function(searchTerms, systemPointer) {
          var loading = '<img src="' + systemPointer + '/sites/all/modules/bento/images/loading.gif"/>';
          var externalLink = systemPointer + '/sites/all/modules/bento/images/external-link-16.png';
          var moreOptions = systemPointer + '/sites/all/modules/bento/images/icon_gears-16.png';
          var advancedLink = 'http://uncw.summon.serialssolutions.com/advanced?summonVersion=2.0#!/advanced';
          var catalogAdvancedPart1 = 'http://libcat.uncw.edu/search~S4/X?NOSRCH=';
          var catalogAdvancedPart2 = '&searchscope=4&SORT=D&SUBKEY=';

          // BOOKS

          $('.bento-results-content-books').html(loading);
          var booksUrl = systemPointer + '/bento_catalog_books';

          $.ajax({
            type: 'POST',
            url: booksUrl,
            dataType: 'json',
            data: {'searchTerms': searchTerms},
            success: function(response) {
              var results = $.trim(response.reply);
              $('.bento-results-content-books').html(results);
              if (results === 'No results found') {
                var differentSearch = 'http://libcat.uncw.edu/search/X?SEARCH=(' + encodeURIComponent(searchTerms) + ')&searchscope=4';
                var worldcatSearch = 'http://www.worldcat.org/search?q=' + encodeURIComponent(searchTerms);
                var nhcplSearch = 'http://srvlibweb.nhcgov.com/?config=pac#section=search&term=' + encodeURIComponent(searchTerms);
                var cfccSearch = 'http://encore.cfcc.edu/iii/encore_cfcc/search?lang=eng&target=' + encodeURIComponent(searchTerms);
                var alternativeSearches = '. Try a different search in the <a href="' + differentSearch;
                alternativeSearches += '" target="_blank"> UNCW Library Catalog</a>.<br><br>';
                alternativeSearches += 'Or search <a href="' + worldcatSearch  + '" target="_blank">WorldCat.org</a>, ';
                alternativeSearches +=  '<a href="' + nhcplSearch  + '" target="_blank">New Hanover County Public Library</a>, ';
                alternativeSearches +=  'or <a href="' + cfccSearch  + '" target="_blank">Cape Fear Community College</a>.<br><br>';
                alternativeSearches += 'Can\'t find what you need? <a href="/ask" target="_blank">Ask Us!</a>';
                $('.bento-results-content-books').append(alternativeSearches);
              }
              else {
                var viewAll = 'http://libcat.uncw.edu/search/X?SEARCH=(' + searchTerms + ')&searchscope=4&SORT=D&m=a&m=c&m=h&b=wg&b=wj&b=wr&b=wf&b=wh&b=wb&b=wc&b=we&b=wi&b=wl&b=wn&b=ws&b=wu&b=wv&b=eb';
                if ((response.resultsCount !== '1') && (response.resultsCount !== 'X')) {
                  $("#bento-results-books .bento-results-footer img.bento-see-all").attr("src", externalLink);
                  $("#bento-results-books .bento-results-footer img.bento-more-options").attr("src", moreOptions);
                  $("#bento-results-books .bento-results-footer img").show();
                  $("#bento-results-books .bento-results-footer a.bento-see-all-link").attr("href", viewAll);
                  $("#bento-results-books .bento-results-footer a.bento-see-all-link").text("See all " + numberWithCommas(response.resultsCount) + " results");
                  $("#bento-results-books .bento-results-footer a.bento-more-options-link").attr("href", catalogAdvancedPart1 + searchTerms + catalogAdvancedPart2 + searchTerms);
                  $("#bento-results-books .bento-results-footer a.bento-more-options-link").text("More search options");
                  $("#bento-results-books .bento-results-footer a").show();
                }
              }
            },
            error: function() {
              $('.bento-results-content-databases').html('<span class="bento-error">This search of the Library Catalog could not be completed.</span>');
            }
          });


          // DATABASES

          $('.bento-results-content-databases').html(loading);
          var databasesUrl = systemPointer + '/bento_databases';
          $.ajax({
            type: 'POST',
            url: databasesUrl,
            dataType: 'json',
            data: {'searchTerms': searchTerms},
            success: function(response) {
              var results = $.trim(response.reply);
              $('.bento-results-content-databases').html(results);
              if (results === 'No results found') {
                var noResults = 'No databases found.  Try our <a href="http://library.uncw.edu/find_databases" target="_blank">Find Databases guide</a> or ';
                $('.bento-results-content-databases').html(noResults);
                $('.bento-results-content-databases').append('<a href="/ask" target="_blank">Ask Us!');
              }
              else {
                var viewAll = 'https://library.uncw.edu/search/node/' + searchTerms + '%20type%3Aresource_page';
                if (response.resultsCount !== '1') {
                  $("#bento-results-databases .bento-results-footer img.bento-see-all").attr("src", externalLink);
                  $("#bento-results-databases .bento-results-footer img.bento-more-options").attr("src", moreOptions);
                  $("#bento-results-databases .bento-results-footer img").show();
                  $("#bento-results-databases .bento-results-footer a.bento-see-all-link").attr("href", viewAll);
                  $("#bento-results-databases .bento-results-footer a.bento-see-all-link").text("See all results");
                  $("#bento-results-databases .bento-results-footer a.bento-more-options-link").attr("href", 'https://library.uncw.edu/search/');
                  $("#bento-results-databases .bento-results-footer a.bento-more-options-link").text("More search options");
                  $("#bento-results-databases .bento-results-footer a").show();
                }
              }
            },
            error: function() {
              $('.bento-results-content-databases').html('<span class="bento-error">This search of the library databases could not be completed.</span>');
            }
          });


          // SCHOLARLY ARTICLES

          $('.bento-results-content-scholarly-articles').html(loading);
          var scholarlyArticlesUrl = systemPointer + '/bento_scholarly_articles';
          var scholSearchTerms = searchTerms.replace(/-/g, ' ');
          scholSearchTerms = searchTerms.replace(/ /g, '%20');
          $.ajax({
            type: 'POST',
            url: scholarlyArticlesUrl,
            dataType: 'json',
            data: {'searchTerms': scholSearchTerms},
            success: function(response) {
              var display = '';
              var results = response.results;
              var limit = results.length;
              if (limit > 5) {
                limit = 5;
              }
              if (limit) {
                var i = 0;
                var result;
                do {
                  result = results[i];
                  display += '<div class="bento-result">';
                  // Journal title.
                  if (result.title && result.link) {
                    display += '<a href="' + result.link + '" target="_blank"><b>' +
                    result.title + '</b></a><br>';
                  }
                  else if (result.title) {
                    display += '<b>'.result.title + '</b><br>';
                  }
                  // Author.
                  if (result.author) {
                    display += 'by ' + result.author + '<br>';
                  }
                  // Source.
                  if (result.randall_source) {
                    display += result.randall_source + '<br>';
                  }
                  display += '</div>';
                  i++;
                } while (i < limit);
                var viewAll = 'http://uncw.summon.serialssolutions.com/#!/search?ho=t&fvf=IsFullText,true,f|IsScholarly,true,f|ContentType,Journal%20Article,f&l=en&q=' + scholSearchTerms;
                if (response.resultsCount !== '1') {
                  $("#bento-results-scholarly-articles .bento-results-footer img.bento-see-all").attr("src", externalLink);
                  $("#bento-results-scholarly-articles .bento-results-footer img.bento-more-options").attr("src", moreOptions);
                  $("#bento-results-scholarly-articles .bento-results-footer img").show();
                  $("#bento-results-scholarly-articles .bento-results-footer a.bento-see-all-link").attr("href", viewAll);
                  $("#bento-results-scholarly-articles .bento-results-footer a.bento-see-all-link").text("See all " + numberWithCommas(response.resultsCount) + " full text online results");
                  $("#bento-results-scholarly-articles .bento-results-footer a.bento-more-options-link").attr("href", advancedLink);
                  $("#bento-results-scholarly-articles .bento-results-footer a.bento-more-options-link").text("More search options");
                  $("#bento-results-scholarly-articles .bento-results-footer a").show();
                }
              }
              else {
                var expandSearch = 'http://uncw.summon.serialssolutions.com/#!/search?ho=t&fvf=IsScholarly,true,f%7CContentType,Journal%20Article,f&l=en&q=' + scholSearchTerms;
                display = 'No results found. <a href="' + expandSearch + '" target="_blank">Expand your search</a> or <a href="/ask" target="_blank">Ask Us!';
              }
              $('.bento-results-content-scholarly-articles').html(display);


              // SCHOLARLY ARTICLES - FULL TEXT AND CITATION ONLY LINK

              var scholarlyArticlesUrl2 = systemPointer + '/bento_scholarly_articles_2';
              $.ajax({
                type: 'POST',
                url: scholarlyArticlesUrl2,
                dataType: 'json',
                data: {'searchTerms': scholSearchTerms},
                success: function(response) {
                  var display = '';
                  var resultsCount = response.resultsCount;
                  if (resultsCount > 1 ) {
                    var viewAll = 'http://uncw.summon.serialssolutions.com/#!/search?ho=t&fvf=IsScholarly,true,f%7CContentType,Journal%20Article,f&l=en&q=' + scholSearchTerms;
                    $("#bento-results-scholarly-articles .bento-results-footer-line2 img.bento-see-all").attr("src", externalLink);
                    $("#bento-results-scholarly-articles .bento-results-footer-line2 a.bento-see-all-link").attr("href", viewAll);
                    $("#bento-results-scholarly-articles .bento-results-footer-line2 a.bento-see-all-link").text("See all " + numberWithCommas(resultsCount) + " results, full text online and citation only");
                  }
                }
              })


              // NEWS AND MAGAZINE ARTICLES

              $('.bento-results-content-news-articles').html(loading);
              var newsUrl = systemPointer + '/bento_news_magazine_articles';
              var newsSearchTerms = searchTerms.replace(/-/g, ' ');
              newsSearchTerms = searchTerms.replace(/ /g, '%20');
              $.ajax({
                type: 'POST',
                url: newsUrl,
                dataType: 'json',
                data: {'searchTerms': newsSearchTerms},
                success: function(response) {
                  var display = '';
                  var results = response.results;
                  var limit = results.length;
                  if (limit > 5) {
                    limit = 5;
                  }
                  //        var title;
                  if (limit) {
                    var i = 0;
                    var result;
                    do {
                      result = results[i];
                      display += '<div class="bento-result">';
                      // Journal title.
                      if (result.title && result.link) {
                        display += '<a href="' + result.link + '" target="_blank"><b>' +
                        result.title + '</b></a><br>';
                      }
                      else if (result.title) {
                        display += '<b>'.result.title + '</b><br>';
                      }
                      // Author.
                      if (result.author) {
                        display += 'by ' + result.author + '<br>';
                      }
                      // Source.
                      if (result.randall_source) {
                        display += result.randall_source + '<br>';
                      }
                      display += '</div>';
                      i++;
                    } while (i < limit);
                    var viewAll = 'http://uncw.summon.serialssolutions.com/#!/search?ho=t&fvf=IsFullText,true,f|ContentType,Newspaper Article,f|ContentType,Magazine Article,f&l=en&q=' + newsSearchTerms;
                    if (response.resultsCount !== '1') {
                      $("#bento-results-news-articles .bento-results-footer img.bento-see-all").attr("src", externalLink);
                      $("#bento-results-news-articles .bento-results-footer img.bento-more-options").attr("src", moreOptions);
                      $("#bento-results-news-articles .bento-results-footer img").show();
                      $("#bento-results-news-articles .bento-results-footer a.bento-see-all-link").attr("href", viewAll);
                      $("#bento-results-news-articles .bento-results-footer a.bento-see-all-link").text("See all " + numberWithCommas(response.resultsCount) + " full text online results");
                      $("#bento-results-news-articles .bento-results-footer a.bento-more-options-link").attr("href", advancedLink);
                      $("#bento-results-news-articles .bento-results-footer a.bento-more-options-link").text("More search options");
                      $("#bento-results-news-articles .bento-results-footer a").show();
                    }
                  }
                  else {
                    var expandSearch = 'http://uncw.summon.serialssolutions.com/#!/search?ho=t&fvf=ContentType,Newspaper%20Article,f%7CContentType,Magazine%20Article,f&l=en&q=' + newsSearchTerms;;
                    display = 'No results found. <a href="' + expandSearch + '" target="_blank">Expand your search</a> or <a href="/ask" target="_blank">Ask Us!';
                  }
                  $('.bento-results-content-news-articles').html(display);
                },
                error: function() {
                  $('.bento-results-content-news-articles').html('<span class="bento-error">This search of news articles could not be completed.</span>');
                }
              });
            },
            error: function() {
              $('.bento-results-content-scholarly-articles').html('<span class="bento-error">This search of scholarly articles could not be completed.</span>');
              $('.bento-results-content-news-articles').html('<span class="bento-error">This search of news articles could not be completed.</span>');
            }
          });

          // NEWS AND MAGAZINE ARTICLES - FULL TEXT AND CITATION ONLY LINK

          var newsUrl2 = systemPointer + '/bento_news_magazine_articles_2';
          var newsSearchTerms = searchTerms.replace(/-/g, ' ');
          newsSearchTerms = searchTerms.replace(/ /g, '%20');
          $.ajax({
            type: 'POST',
            url: newsUrl2,
            dataType: 'json',
            data: {'searchTerms': newsSearchTerms},
            success: function(response) {
              var display = '';
              var resultsCount = response.resultsCount;
              if (resultsCount > 1 ) {
                var viewAll = 'http://uncw.summon.serialssolutions.com/#!/search?ho=t&fvf=ContentType,Newspaper%20Article,f%7CContentType,Magazine%20Article,f&l=en&q=' + newsSearchTerms;
                $("#bento-results-news-articles .bento-results-footer-line2 img.bento-see-all").attr("src", externalLink);
                $("#bento-results-news-articles .bento-results-footer-line2 a.bento-see-all-link").attr("href", viewAll);
                $("#bento-results-news-articles .bento-results-footer-line2 a.bento-see-all-link").text("See all " + numberWithCommas(resultsCount) + " results, full text online and citation only");
              }
            }
          });

          // VIDEOS

          $('.bento-results-content-videos').html(loading);
          var videosUrl = systemPointer + '/bento_catalog_videos';

          // Retrieve results from Drupal using jQuery $.ajax

          $.ajax({
            type: 'POST',
            url: videosUrl,
            dataType: 'json',
            data: {'searchTerms': searchTerms},
            success: function(response) {
              var results = $.trim(response.reply);
              $('.bento-results-content-videos').html(results);
              if (results === 'No results found') {
                var differentSearch = 'http://libcat.uncw.edu/search/X?SEARCH=(' + encodeURIComponent(searchTerms) + ')&searchscope=4';
                var worldcatSearch = 'http://www.worldcat.org/search?q=' + encodeURIComponent(searchTerms);
                var nhcplSearch = 'http://srvlibweb.nhcgov.com/?config=pac#section=search&term=' + encodeURIComponent(searchTerms);
                var cfccSearch = 'http://encore.cfcc.edu/iii/encore_cfcc/search?lang=eng&target=' + encodeURIComponent(searchTerms);
                var alternativeSearches = '. Try a different search in the <a href="' + differentSearch;
                alternativeSearches += '" target="_blank"> UNCW Library Catalog</a>.<br><br>';
                alternativeSearches += 'Or search <a href="' + worldcatSearch  + '" target="_blank">WorldCat.org</a>, ';
                alternativeSearches +=  '<a href="' + nhcplSearch  + '" target="_blank">New Hanover County Public Library</a>, ';
                alternativeSearches +=  'or <a href="' + cfccSearch  + '" target="_blank">Cape Fear Community College</a>.<br><br>';
                alternativeSearches += 'Can\'t find what you need? <a href="/ask" target="_blank">Ask Us!</a>';
                $('.bento-results-content-videos').append(alternativeSearches);
              }
              else {
                var viewAll = 'http://libcat.uncw.edu/search/X?SEARCH=(' + searchTerms + ')&searchscope=4&SORT=D&m=g&b=wa&b=ev';
                if ((response.resultsCount !== '1') && (response.resultsCount !== 'X')) {
                  $("#bento-results-videos .bento-results-footer img.bento-see-all").attr("src", externalLink);
                  $("#bento-results-videos .bento-results-footer img.bento-more-options").attr("src", moreOptions);
                  $("#bento-results-videos .bento-results-footer img").show();
                  $("#bento-results-videos .bento-results-footer a.bento-see-all-link").attr("href", viewAll);
                  $("#bento-results-videos .bento-results-footer a.bento-see-all-link").text("See all " + numberWithCommas(response.resultsCount) + " results");
                  $("#bento-results-videos .bento-results-footer a.bento-more-options-link").attr("href", catalogAdvancedPart1 + searchTerms + catalogAdvancedPart2 + searchTerms);
                  $("#bento-results-videos .bento-results-footer a.bento-more-options-link").text("More search options");
                  $("#bento-results-videos .bento-results-footer a").show();
                }
              }
            },
            error: function() {
              $('.bento-results-content-databases').html('<span class="bento-error">This search of the Library Catalog could not be completed.</span>');
            }
          });

          // GOVERNMENT DOCUMENTS

          $('.bento-results-content-gov-docs').html(loading);
          var govDocsUrl = systemPointer + '/bento_gov_docs';

          $.ajax({
            type: 'POST',
            url: govDocsUrl,
            dataType: 'json',
            data: {'searchTerms': searchTerms},
            success: function(response) {
              var results = $.trim(response.reply);
              $('.bento-results-content-gov-docs').html(results);
              if (results === 'No results found') {
                var noResults = 'No government documents found.  Try our <a href="http://library.uncw.edu/gov_docs" target="_blank">Search for Government Documents guide</a> or ';
                $('.bento-results-content-gov-docs').html(noResults);
                $('.bento-results-content-gov-docs').append('<a href="/ask" target="_blank">Ask Us!');
              }
              else {
                var viewAll = 'http://libcat.uncw.edu/search~S4/X?SEARCH=(' + searchTerms + ')&SORT=D&b=wd';
                var moreSearchOptions = 'http://libcat.uncw.edu/search~S4/X?NOSEARCH=(' + searchTerms + ')&SORT=D&b=wd&SUBKEY=' + searchTerms;
                if ((response.resultsCount !== '1') && (response.resultsCount !== 'X')) {
                  $("#bento-results-gov-docs .bento-results-footer img.bento-see-all").attr("src", externalLink);
                  $("#bento-results-gov-docs .bento-results-footer img.bento-more-options").attr("src", moreOptions);
                  $("#bento-results-gov-docs .bento-results-footer img").show();
                  $("#bento-results-gov-docs .bento-results-footer a.bento-see-all-link").attr("href", viewAll);
                  $("#bento-results-gov-docs .bento-results-footer a.bento-see-all-link").text("See all " + numberWithCommas(response.resultsCount) + " results");
                  $("#bento-results-gov-docs .bento-results-footer a.bento-more-options-link").attr("href", moreSearchOptions);
                  $("#bento-results-gov-docs .bento-results-footer a.bento-more-options-link").text("More search options");
                  $("#bento-results-gov-docs .bento-results-footer a").show();
                }
              }
            },
            error: function() {
              $('.bento-results-content-databases').html('<span class="bento-error">This search of the Library Catalog could not be completed.</span>');
            }
          });






          // JOURNALS

          $('.bento-results-content-journals').html(loading);
          var journalsUrl = systemPointer + '/bento_catalog_journals';
          $.ajax({
            type: 'POST',
            url: journalsUrl,
            dataType: 'json',
            data: {'searchTerms': searchTerms},
            success: function(response) {
              var results = $.trim(response.reply);
              $('.bento-results-content-journals').html(results);
              if (results === '') {
                results = 'No results found';
              }
              var usedKeyWord = response.usedKeyWordSearch;
              if (response.usedKeyWordSearch === '') {
                var usedKeyWord = response.usedKeyWordSearch = false;
              }
              if (results === 'No results found') {
                var noResultsLink = 'http://libcat.uncw.edu/search/X?SEARCH=%28' + searchTerms + '%29&searchscope=4&SORT=D&m=s';
                var noResults = 'No matching journal titles found. Try searching for <a href="' + noResultsLink + '" target= "_blank">journals by keyword</a>';
                $('.bento-results-content-journals').html(noResults + ' or <a href="/ask" target="_blank">Ask Us!');
              }
              else {
                if (usedKeyWord === true) { var viewAll = 'http://libcat.uncw.edu/search/X?SEARCH=%28' + searchTerms + '%29&searchscope=4&SORT=D&m=s'; }
                else { var viewAll = 'http://libcat.uncw.edu/search/?searchtype=j&searcharg=' + searchTerms; }
                if (!isInArray(response.resultsCount, ['1', 'X'])) {
                  $("#bento-results-journals .bento-results-footer img.bento-see-all").attr("src", externalLink);
                  $("#bento-results-journals .bento-results-footer img.bento-more-options").attr("src", moreOptions);
                  $("#bento-results-journals .bento-results-footer img").show();
                  $("#bento-results-journals .bento-results-footer a.bento-see-all-link").attr("href", viewAll);
                  $("#bento-results-journals .bento-results-footer a.bento-see-all-link").text("See all " + numberWithCommas(response.resultsCount) + " results");
                  $("#bento-results-journals .bento-results-footer a.bento-more-options-link").attr("href", catalogAdvancedPart1 + searchTerms + catalogAdvancedPart2 + searchTerms);
                  $("#bento-results-journals .bento-results-footer a.bento-more-options-link").text("More search options");
                  $("#bento-results-journals .bento-results-footer a").show();
                }
              }
            },
            error: function() {
              $('.bento-results-journals').html('<span class="bento-error">This search of the Library Catalog could not be completed.</span>');
            }
          });
          //    // More search options link for Google library websites search
          $("#bento-results-websites .bento-results-footer img.bento-more-options").attr("src", moreOptions);
          $("#bento-results-websites .bento-results-footer img").show();
          $("#bento-results-websites .bento-results-footer a.bento-more-options-link").attr("href", 'https://cse.google.com/cse/publicurl?cx=005978018638547358306:xrqdgqxe2na');
          $("#bento-results-websites .bento-results-footer a.bento-more-options-link").text("More search options");
          $("#bento-results-websites .bento-results-footer a").show();
        }); // end search function




        // Format numbers with commas.

        var numberWithCommas = (function(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
        // Determine if a string is in an array.

        var isInArray = (function(value, array) {
          return array.indexOf(value) > -1;
        });

      }
    }(jQuery));
