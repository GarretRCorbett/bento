Randall Library Bento Box Module README
---------------------------------------

# Note From Randall Library Developer

Thank you very much for taking an interest in Randall Library's Bento Box module. This is the first iteration of this module uploaded to github.
For that reason, it is not yet designed for easy adoption to other University Libraries. At the bottom of this README are instructions on how to
configure the module for your library. To accomplish this though, we highly reccomend a developer with strong php, javascript, and drupal knowledge.
Bearing sufficient interest, future versions of this module will be developed to support easy adoption.

For any questions regarding this module,
please contact [Laura Wiegand](mailto:wiegandl@uncw.edu) - 	Associate Director, Library Information Technology and Digital Strategies/Librarian
 or [Garret Corbett](mailto:corbettg@uncw.edu) - 	Web and Applications Developer.

Special thanks to to the primary develeloper of this module, Robert P. Humphrey.

# About

This application is built as a Drupal 7 module, and is based on a similar application developed by NC Live:
http://www.nclive.org/search-everything
The application allows the user to enter a search string, and then searches multiple sources to find related items, including books, videos, CDs,
and articles. Searches are performed using the Randall Library catalog, Summon (the library's aggegated search service), and also Google.

# Files

The main two files that make up the module are bento.module, which contains the PHP code for the application, and bento.js, which contains the JavaScript code.  

There are a number of additional files created by NC Live that contain useful utilities for performing the various search functions.  These files all begin with nclive_.  

There are also a number of files in the magpierss folder. Magpie RSS (http://magpierss.sourceforge.net/) is used to parse the XML returned by queries made using the Summon API (http://www.proquest.com/products-services/discovery-services/The-Summon-Service.html).

There is also a file named simple_html_dom.php.  This file contains the Simple HTML DOM Parser (http://simplehtmldom.sourceforge.net/) that is used to screen scrape the information returned from the Randall Library catalog.

# Page structure

When the user navigates to http://library.uncw.edu/search_randall, Drupal runs the bento_page_structure() function in file bento.module.  This creates the bento boxes.  That is, itsets up all the divs on the page that will be used to contain the various search results.

If the user has entered search terms, the entire page is displayed.  Otherwise, only the top part of the page is visible.  This contains the form used to enter search terms.

The function also loads the JavaScript files needed by the application.

# JavaScript

Once the basic page html structure has been loaded, the various functions in file bento.js are called to accomplish the following:

* Get the information entered in the search terms form.
* Show and hide the appropriate parts of the page. Many sections of the page are hidden until the application has obtained data to put in those containers.
* Make a call to the Google custom search API to obtain the results for the Library Websites & Digital Collections.
* Make calls to PHP functions in bento.module to obtain the results for all the other sections on the page.  

JavaScript is used so that some results can quickly begin to appear on the page.  If the application was built entirely in PHP, the user would have to wait until all the results were returned before any of them would be displayed.  

# Catalog queries

The following bento box sections are built using information from the library catalog:

* books and ebooks
* videos and music
* government documents

For each section, a call is made from bento.js to a function in bento.module. The PHP function takes the user entered search terms and makes a second call to the library catalog using the file_get_html() function in file simple_html_dom.php. This function retrieves the same html that a browser would receive making a call to the library catalog with the same search terms. Then, using the retrieved html, the function applies a number of screen scraping functions available through the Simple DOM HTML Parser to extract the required fields needed for the Bento display. The search results are formatted into HTML and returned to the JavaScript calling function.

The reason this approach is used is because the library wants the various Bento box containers to display the exact same information as the other library website search pages. The easiest way to do this would be to query the catalog directly using the Sierra API. However, Sierra is a proprietary product, and the vendor is unwilling to share its search algorithms with its customers. Therefore, there is no way to know how to replicate the search using the Sierra API to get the exact same results as the other website pages. Therefore, the screen scraping approach is used. It's a more complicated way to get the needed data, but at least it's consistent with the other search pages.

# Summon queries

The following bento box sections are built using the Summon discovery service API:

* scholarly articles
* news and magazine articles
* databases
* journals, magazine and newspapers by title

For each section, a call is made from bento.js to a function in bento.module. The PHP function takes the user entered search terms and makes a second call to the Summon API using the sumon_tools__request() function. Summon returns an XML reply, which is parsed by the MagpieRSS parser to extract the needed information. The search results are then formatted into HTML and returned to the JavaScript calling function.

# Configuring the Module

In order to configure this module for your personal use, you will have to take a vairety of steps.

* First, replace the 'place_your_university_information_here' return statements in api_credentials.ini and in summon_api_credentials.php
* Second, replace the Randall Library specific help information stored in the $display variable in bento.module with your university's information.
* Third, if you are planning on using the screen scraping method, you will want to update all of the $search_parameters and all of the variables used to make up the $html
link ($new_base, $add_base, $short_base) variables as well. After you have accomplished that you will have to edit the screen scrapping in each of those functions to match
the data your catalog returns.
