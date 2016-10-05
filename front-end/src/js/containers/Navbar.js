import React from 'react';


export default class Navbar extends React.Component {
	render() {
		return (
		<nav class="navbar navbar-default">
  	<div class="container-fluid">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Selonia</a>
    </div>

    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Home <span class="sr-only">(current)</span></a></li>
        <li><a href="#">Logs</a></li>
        <li><a href="#">Templates</a></li>
        <li><a href="#">Domains</a></li>
        <li><a href="#">Campgains</a></li>
      </ul>
	    </div>
	  </div>
	</nav>
		)
	}
}