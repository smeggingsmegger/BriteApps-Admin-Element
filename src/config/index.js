// THIS FILE IS GOING TO BE OVERWRITTEN ON BUILD SERVER
// BA Admin Port
var port = 8081

// useful to test from real mobile device while running dev server
var apiRoot = window.location.protocol + '//'+window.location.hostname + ':' + port

if (process.env.API_ROOT) {
  apiRoot = process.env.API_ROOT
}

var config = {
  url: apiRoot
}

config.login_as_company_staff = config.url + '/login_as_company_staff/'
config.get_carrier_user = config.url + '/get_carrier_user/'

config.list_builds_per_company = config.url + '/builds/'
config.builds_details = config.url + '/build/'
config.desktop_builds_details = config.url + '/desktop-build/'


export default config
