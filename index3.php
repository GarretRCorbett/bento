<html>
<head>
                <link href="bento.css" media="all" rel="stylesheet" type="text/css" />
                </head>
                <body>
                <form action="index6-jt-kw.php" method="post">

                Search Again: <input type="text" name="search" value="" />
                                <input type="submit" name="submit" value="submit" />
                </form>
<?php
require_once( 'simple_html_dom.php' );

$search = $_POST["search"];
$search_term =  str_replace(' ','%20',$search);

//putting the seqarch term between two strings new_base and add_base to construct search limiting by material type and collection
$new_base = 'http://libcat.uncw.edu/search/X?SEARCH=(';
$add_base = ')&searchscope=4&SORT=D&m=a&m=c&b=wg&b=wj&b=wr&b=wf&b=wh&b=wb&b=wc&b=we &b=wf&b=wi&b=wl&b=wn&b=ws&b=wu&b=wv';
$short_base='https://libcat.uncw.edu';


                ?>

<?php
//let them know what their search terms were
echo "You searched for <b>".$search."</b><br />";

echo '<div class="left">';
//Get the libcat.uncw.edu page with search argument(s)
$html = file_get_html( $new_base . $search_term . $add_base);


// using our knowledge of the libcat results page to find where item information is on the results screen
$records = $html->find( '.briefcitDetail ');

//Give them an opportunity to look at all results
echo '<h2>Books</h2>';
echo 'Limited to: Material Type "BOOK" or "MUSIC SCORE" and Location "UNCW General Collection" or "UNCW Juvenile Collection" or "UNCW Audiobooks" or "UNCW Reference" or "UNCW Featured New Books" or "" or "UNCW Curriculum Materials Ctr" or "UNCW Education Lab" or "UNCW Index Collection" or "UNCW Associated Collections" or "UNCW SENC Collection" or "UNCW Special Collections" or "UNCW Archives"<br /><br />';
echo '<br /><a href="' . $new_base . $search_term  . $add_base . '">See All</a><br /><br />';


//set counter to only retrieve 6 results
$j=0;

//Start to cycle through the results page to look for result information
foreach( $records as $record ) {

//break out once 6 has been reached
if(++$j ==7) break;

//set one of the values that should be there as a variable
$collection=$record->getElementsByTagName( 'td', 0 )->plaintext;

//check to see if that value doesn't exist and if it doesn't look at the item itself for more information
if (empty($collection)) {

//set up the connection part to look at a new page, in this case the item
$url=$record->getElementsByTagName( 'a', 0 )->href;
$html_item = file_get_html( $short_base . $url );

//This is where the appropriate information is located on the item page
$record_item = $html_item->find( '.bibLinks');

//cycle through the item page to look for the bits you need
foreach( $record_item as $item ) {

$item_info= $item->getElementsByTagName( 'tr', 0 )->plaintext;
}
}

//if the information (in this case collection) that you checked for was there then just assign it to a variable here
else {
$item_info=$record->getElementsByTagName( 'td', 0 )->plaintext;
}

//if the information is still not available that probably means it is on order or something like that so check for that
if (empty($item_info)) {

//This is where the appropriate information for an ORDER is located on the item page
$record_item = $html_item->find( '.bibOrderEntry');

//cycle through the item page again to look for this information
foreach( $record_item as $item ) {

$item_info= $item->getElementsByTagName( 'td', 0 )->plaintext;
}
}



 //output everything you have gathered so far: Title, collection, Call#, Availability
echo '<a href="https://libcat.uncw.edu'.
  $record->getElementsByTagName( 'a', 0 )->href.'">'.
  $record->getElementsByTagName( 'a', 0 )->plaintext .
  '</a>'.
//           $record_item->getElementsByTagName( 'td', 0 )->plaintext .
  '<br />'.
  //Collection value if displayed on results screen, otherwise retrieved from item (electronic, or on order)
    $item_info .
        '  '.
    $record->getElementsByTagName( 'td', 1 )->plaintext .
     '  '.
    $record->getElementsByTagName( 'td', 2 )->plaintext .
  PHP_EOL;

//set variable to next value if it exists display next three values (collection, Call#, Availability)
$more1=$record->getElementsByTagName( 'td', 3 )->plaintext;

if ($more1) {
echo '<br />' . $record->getElementsByTagName( 'td', 3 )->plaintext .
$record->getElementsByTagName( 'td', 4 )->plaintext  .
$record->getElementsByTagName( 'td', 5)->plaintext;

}

//check for third item and if exists display notice
$more2=$record->getElementsByTagName( 'td', 6 )->plaintext;

if ($more1) {
echo '<br /> Additional Items exist';
}




  echo "<br /><br />";

  //set variable to the title URL from results screen to see if there even was a results screen
  $howmany=$record->getElementsByTagName( 'a', 0 )->href;

  //zero out a couple of variables
  unset($collection);
  unset($item_info);
  unset($check_elec);

}


//if there was no URL then you must have ended up on a title screen for one item result
if (empty($howmany)) {

//This is where the TITLEis located on the item page
$records = $html->find( '.bibDisplayTitle');

echo '<br /><br />';

//cycle through the item page
foreach($records as $record ) {
$title = $record->getElementsByTagName( 'td', 0 )->plaintext;

//Just taking the word TITLE out of the string
$new_title = substr($title, 9, 999);

//displaying the title
echo '<a href="'. $base . $search_term . '">' . $new_title . '</a><br />';



//echo '<strong>' . $title . '</strong>';


}
//This is where the appropriate information for collection etc.. is located on the item page
$records = $html->find( '.bibItemsEntry');

//cycle back through item page
foreach( $records as $record ) {

//print out collection, call#, availability, doesn't currently account for e-resource or on order item
echo  $record->getElementsByTagName( 'td', 0 )->plaintext . ' ' .
 $record->getElementsByTagName( 'td', 1 )->plaintext . ' ' .
$record->getElementsByTagName( 'td', 2 )->plaintext;


}
}
else {
//gives them another opportunity to look up search term in results screen
echo '<div class="see-all"> <a href="' . $base . $search_term  . '">See All</a></div><br />';
}
