import img from './logo.png'

import("../../../node_modules/bootstrap/dist/css/bootstrap.min.css");
import("../../../node_modules/bootstrap/dist/css/bootstrap-theme.min.css");
import("../../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css");
import("../../../node_modules/bootstrap-toggle/css/bootstrap-toggle.min.css");
import("../../../node_modules/json-human/css/json.human.css");
import("../../../node_modules/chosen-js/chosen.min.css");
import("../../../node_modules/select2/dist/css/select2.min.css");
import("../../../node_modules/spin.js/spin.css");
import("./extra.css");

function importAll(r) { return r.keys().map(r); }
importAll(require.context('../../../node_modules/chosen-js', true, /\.(png|jpe?g|svg)$/));

$(document).ready(function () {
    document.getElementById("logo").src = img;
})
