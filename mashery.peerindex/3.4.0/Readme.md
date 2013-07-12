PEERINDEX API DEMO APP
==================================================================
Created lovingly for the developer community by Mashery.

http://www.mashery.com

http://developer.mashery.com


SYNOPSIS
==================================================================
This demo App provides a way to see the PeerIndex API in action. 
It's built using Intel's Cross Platform Development Kit (XDK) 
that lets you create mobile apps for smartphones and tablets using
standard web languages (HTML5, CSS, and JavaScript).



FEATURES
==================================================================
Uses PeerIndex's API to find PeerIndex score based on your Twitter handle.



GETTING STARTED
==================================================================
You will need the following to get started -

1. Intel's XDK. Free Download - http://xdk-software.intel.com/
2. A PeerIndex API key (Register at https://developers.peerindex.com/member/register).



OBTAINING THE API KEY
==================================================================
Before you can begin using this app, you will need to get an API key 
from PeerIndex at https://developers.peerindex.com/member/register. This will also 
give you a Single Sign-On Mashery ID with access to hundreds of other APIs.


SETTING UP THE API KEY IN THIS APP
==================================================================
Once you have obtained your API key, assign the API key to the 
variable api_key on line 1 of the file PeerIndex.js, like so -

<pre>
	var api_key ='your_api_key_here';
</pre>

If your API Key surpasses the Rate Limit, contact api@peerindex.com to discuss higher usage levels.


ABOUT THE PEERINDEX API
==================================================================

PeerIndex API allows developers access to the following information -

1. PeerIndex Score - A relative measure of an actor's online influence (a normalised score of range 0-100, where 0 is the lowest and 100 is the highest). For more information on the PeerIndex score, take a look at the <a href="http://help.peerindex.com/">FAQ section on peerindex.com</a>
2. Activity (score) - Normalised 0 to 100 score representing the frequency of which the actor shares content on the social web
3. Authority (score) - Normalised 0 to 100 score representing the degree to which the actor's audience recognises them as a thought leader
4. Audience (score) - Normalised 0 to 100 score representing the effective size of the audience the actor's messages reach
5. Topic score - Topic scores are normalised between 0 and 100 (A topic score of 0 indicates an actor has no recognised interest or authority in the topic. A score of 100 would indicate the actor is likely to be a world leading authority on the topic)



Learn more about the PeerIndex API at https://developers.peerindex.com/


PEERINDEX API DOCUMENTATION
==================================================================
To learn more about the data set provided by PeerIndex's API, you can read 
through the API documentation at https://developers.peerindex.com/io-docs


ABOUT THE MASHERY API NETWORK
==================================================================
The Mashery API Network (http://developer.mashery.com) is an open
data commons of over 50 RESTful APIs that developers can access 
with their Mashery ID.  

Mashery is the world's leading API management service provider, helping 
companies provide the best API experience for developers, as well as 
the most advanced API management and reporting tools to our clients. 


EXPLORE MORE APIS
==================================================================
Check out Mashery's API Network at http://developer.mashery.com/apis
to explore other awesome APIs including NY Times, Klout, USA TODAY, 
Rotten Tomatoes, Best Buy, Hoovers, Edmunds, Netflix, Rdio and many more. 


SUPPORT
==================================================================
If you have any questions or need any help obtaining an API key, 
you can reach out to us at: developer-relations@mashery.com
