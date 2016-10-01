import React from 'react';


export default class Navbar extends React.Component {
	render() {
		return (
			<nav class="navbar navbar-default">
			  <div class="container">
			  	<div class="navbar-header">
	        	<p><a class="navbar-brand" href="#">Selonia</a> </p>
	        </div>

	        <ul class="nav navbar-nav">
	          <li class="active"><a href="#">Main <span class="sr-only">(current)</span></a></li>
        		<li><a href="#">Logs</a></li>
	        </ul>
	        	<div class="navbar-right">
		        	<form class="navbar-form navbar-left">
				        <button type="submit" class="btn btn-default">Profile</button>
				        <button type="submit" class="btn btn-default">Logout</button>
	      			</form>
	        	</div>
	        </div>
			</nav>
		)
	}
}