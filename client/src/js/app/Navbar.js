import React from 'react';
import { Link } from 'react-router'
import cls from 'classnames';

export default class Navbar extends React.Component {
	render() {
    const { pathname } = this.props.location;
    const indexActive = cls({'active': pathname === '/'});
    const campaignsActive = cls({'active': ~pathname.indexOf('campaigns')});
    const templatesActive = cls({'active': ~pathname.indexOf('templates')});
    const logsActive = cls({'active': ~pathname.indexOf('logs')});

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
        <li class={indexActive}><Link to='/'>Home <span class="sr-only">(current)</span></Link></li>
        <li class={campaignsActive}><Link to='campaigns'>Campaigns</Link></li>
        <li class={templatesActive}><Link to='templates'>Templates</Link></li>
        <li class={logsActive}><Link to='logs'>Logs</Link></li>
      </ul>

      <ul class="nav navbar-nav navbar-right">
        <li><Link to='logout'>Logout</Link></li>
      </ul>
	    </div>
	  </div>
	</nav>
		)
	}
}