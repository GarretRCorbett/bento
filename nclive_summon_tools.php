<?php

function summon_tools__request($api_id, $api_key, $query, $offset = 0, $limit = 10, $sort = False, $doctype = "xml") {
  /* Returns response in $doctype format (xml|json) from Summon 2.0 API for a $query.

    - Results start at $offset for a total of $limit results.
    - Results are sorted by relevance ($sort = False) or date-descending ($sort = True).
    - Code based on Python code here: https://gist.github.com/lawlesst/1070641
    - See also: http://blog.humaneguitarist.org/2014/09/04/getting-started-with-the-summon-api-and-python/
    - See also: http://blog.humaneguitarist.org/2014/11/16/using-the-summon-api-with-a-simple-php-script/
   */

  // set API host and path.
  $host = "api.summon.serialssolutions.com";
  $path = "/2.0.0/search";

  // create query string.
  $query = "s.q=" . $query . "&s.pn=$offset&s.ps=$limit&s.ho=true";

  // set sort to date-descending if needed.
  if ($sort != False) {
    $query = $query . "&s.sort=PublicationDate:desc";
  }

  // sort and encode $query.
  $query_sorted = explode("&", $query);
  asort($query_sorted);
  $query_sorted = implode("&", $query_sorted);
  $query_encoded = urldecode($query_sorted);

  // create request headers.
  $accept = "application/$doctype";
  $date = gmstrftime("%a, %d %b %Y %H:%M:%S GMT", time());
  $id_string = implode("\n", array($accept, $date, $host, $path, $query_encoded, ""));
  $digest = base64_encode(hash_hmac("sha1", utf8_encode($id_string), $api_key, True));
  $authorization = "Summon " . $api_id . ";" . $digest;
  $headers = array("Host:$host", "Accept:$accept", "x-summon-date:$date", "Authorization:$authorization");

  // call API; return response.
  $url = "http://$host$path?$query";
  $response = url_tools__request($url, $timeout = 10, $headers = $headers);
  return $response;
}

function summon_tools__parse_xml($module, $response, $exact) {
  /* Returns PHP array of results for a given $module after parsing Summon API XML $response.
    Uses $exact user query to determine _match_score. */

  // create output array.
  $results = array("_total_results" => 0);
  $results["results"] = array();

  // load XML response.
  $xml = simplexml_load_string($response);
  if (!is_object($xml)) {
    return array($module => array("_error" => "Could not get and/or parse response for $module.", "_total_results" => 0, "results" => array()));
  }

  // get total results.
  $total = $xml->xpath("@recordCount");
  $total = strval($total[0]);
  $results["_total_results"] = $total;

  // get all response items.
  $articles = $xml->xpath("documents/document");

  // create results for each item of article metadata.
  foreach ($articles as $article) {

    // get title.
    $title = $article->xpath("field[@name='Title'][1]/value");
    $title = strip_tags($title[0]);

    $subtitle = $article->xpath("field[@name='Subtitle'][1]/value");
    if (count($subtitle) > 0) {
      $title = $title . ": " . strip_tags($subtitle[0]);
    }

    $title = string_tools__truncate($title, 25);
    $title = htmlspecialchars($title);

    // get link; skip over item if link doesn't exist.
    $link = $article->xpath("@link[1]");
    if (count($link) < 1) {
      continue;
    }
    $link = htmlspecialchars($link[0]);

    // get date.
    $date = $article->xpath("field[@name='PublicationDate_xml'][1]/datetime[1]/@year");
    $date = strip_tags($date[0]);
    $date = htmlspecialchars($date);

    $year = $date;
    $month = $article->xpath("field[@name='PublicationDate_xml'][1]/datetime[1]/@month");
    $m = count($month);
    if ($m) {
      $month = strip_tags($month[0]);
      $month = htmlspecialchars($month);
    }
    else {
      $month = '';
    }
    $day = $article->xpath("field[@name='PublicationDate_xml'][1]/datetime[1]/@day");
    $l = count($day);
    if ($l) {
      $day = strip_tags($day[0]);
      $day = htmlspecialchars($day);
    }
    else {
      $day = '';
    }

    // get description.
    $description = $article->xpath("field[@name='Snippet'][1]/value");
    if ($description) {
      $description = strip_tags($description[0]);
      $description = string_tools__truncate($description);
      $description = htmlspecialchars($description);
    }
    else {
      $description = "";
    }

    // get author.
    $author = $article->xpath("field[@name='Author'][1]/value");
    $author_count = count($author);
    $author = array_slice($author, 0, 3); //no more than 3 authors.
    $author = strip_tags(implode("; ", $author));
    $author = htmlspecialchars($author);

    // nullify $author if the data is non-alpha (yes ... we've seen dates in the author field!).
    if (preg_replace("/[^a-zA-Z]/", "", $author) == "") {
      $author = "";
      $author_count = 0;
    }

    if ($author == "Anonymous") {
      $author = "";
      $author_count = 0;
    }

    if ($author_count > 3) {
      $author = $author . " and others";
    }

    // get source by concatenating bibliographic information.
    $source_publication = $article->xpath("field[@name='PublicationTitle'][1]/value");
    $randall_source_publication = "";
    if (count($source_publication) > 0) {
      $source_publication = strip_tags($source_publication[0]);
      $source_publication = htmlspecialchars($source_publication);
      $randall_source_publication = "<em>$source_publication</em>, ";
      $source_publication = "<em>$source_publication</em>, ";
    }
    else {
      $source_publication = "";
      $randall_source_publication = "";
    }

    $source_publisher = $article->xpath("field[@name='Publisher'][1]/value");
    if (count($source_publisher) > 0 && $source_publication == "") {
      $source_publisher = strip_tags($source_publisher[0]);
      $source_publisher = htmlspecialchars($source_publisher);
      $source_publisher = "$source_publisher, ";
    }
    else {
      $source_publisher = "";
    }

    $source_volume = $article->xpath("field[@name='Volume'][1]/value");
    if (count($source_volume) > 0) {
      $source_volume = strip_tags($source_volume[0]);
      $source_volume = htmlspecialchars($source_volume);
      $source_volume = "Volume&nbsp;$source_volume, ";
    }
    else {
      $source_volume = "";
    }

    $source_issue = $article->xpath("field[@name='Issue'][1]/value");
    if (count($source_issue) > 0) {
      $source_issue = strip_tags($source_issue[0]);
      $source_issue = htmlspecialchars($source_issue);
      $source_issue = "Issue&nbsp;$source_issue, ";
    }
    else {
      $source_issue = "";
    }

    $source = $source_publication . $source_publisher . $source_volume . $source_issue;
    $source = substr(trim($source), 0, -1); //remove trailing comma.

    // Randall source display

//    if ($module == 'summon_articles') {
//      $page_prefix = "p.&nbsp;";
//    }
//    else if ($module == 'summon_news') {
//      $page_prefix = '';
//    }

    $page_prefix = "p.&nbsp;";

    $source_page = $article->xpath("field[@name='StartPage'][1]/value");
    if (count($source_page) > 0) {
      $source_page = strip_tags($source_page[0]);
      $source_page = htmlspecialchars($source_page);
      $source_page = $page_prefix . $source_page . ", ";
    }
    else {
      $source_page = "";
    };

    $months = array('xxx', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');

    $display_date = '';
    $source_display_date = '';
//    if ($module == 'summon_articles') {
//      if ($month) {
//        $display_date .= $month;
//      }
//      if ($month && $year) {
//        $display_date .= '/';
//      }
//      if ($year) {
//        $display_date .= $year;
//        $source_display_date = "$display_date, ";
//      }
//    }
//    else if ($module == 'summon_news') {
      $month_found = FALSE;
      if ($month && $year) {
        $trimmed_month = ltrim($month, "0");
        $string_month = $months[intval($trimmed_month)];
        if ($string_month) {
          $month_found = TRUE;
          $display_date .= $string_month . ' ';
        }
      }
      if ($month_found && $day && $year) {
        $trimmed_day = ltrim($day, "0");
        $display_date .= $trimmed_day . ', ';
      }
      if ($year) {
        $display_date .= $year;
        $source_display_date = "$display_date, ";
      }
//    }
//
//    if ($module == 'summon_articles') {
      $randall_source = $randall_source_publication . $source_display_date . $source_volume . $source_issue . $source_page;
//    }
//    else if ($module == 'summon_news') {
//      $randall_source = $randall_source_publication . $source_display_date . $source_page;
//    }

    $randall_source = substr(trim($randall_source), 0, -1); //remove trailing comma.
    // calculate_match_score and create result array.
    $_match_score = similarity_tools__calculate_similarity($exact, $title);
    $temp = array("_match_score" => $_match_score,
      "title" => $title,
      "image" => "",
      "image_m" => "",
      "link" => $link,
      "link_m" => $link,
      "date" => $date,
      //         "description"=>$description,
      "author" => $author,
      "source" => $source,
      "year" => $year,
      "month" => $month,
      "day" => $day,
      "randall_source" => $randall_source,
    );

    // add result to output array.
    array_push($results["results"], $temp);
  }

  // return output.
  $output = array($module => $results, 'count' => $total);
  return $output;
}

?>
