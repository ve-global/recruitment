var KLEPTO = KLEPTO || {};

(function(win, KLEPTO){
    'use strict';

    function Visualiser(document) {
        this.setup(document, win);
    }

    //Visualiser.prototype.register_into_dom = function (document_) {
    Visualiser.prototype.setup = function (document_, window) {

        /*
        // http://www.w3schools.com/howto/howto_css_modals.asp
        var html0 = `<!-- The Modal -->
        <div id="myMiniPanel" class="modal">

          <!-- Modal content -->
          <div class="modal-content">
            <span class="close">x</span>
            <div id=visualiser_content_main>
            <p >Some text in the Modal..</p>
            </div>
          </div>
        </div>`;
        */

        // relative: http://www.w3schools.com/css/tryit.asp?filename=trycss_position_absolute
        // <div id=visualiser_content_main style="position: absolute; top: 10px; right: 30px; width: 200px; height: 100px; border: 3px solid #73AD21;">
        // <div id=visualiser_content_main style="position: fixed; top: 10px; right: 10px; width: 200px; height: 100px; border: 3px solid #73AD21;">

        var html = `<!-- The Modal -->
        <div>
            <div class="visualiser_panel" id=myMiniPanel>
            <span class="close">&#10006;</span>
            <div id=visualiser_content_main>
            (please wait)
            </div>
            </div>
        </div>`;

        //console.log("************************");
        //console.log(html);

        var dom = document_.querySelector("#visualiser_content_main");
        if (dom) {
            console.error("Already added.");
            return;
        }
        // var node = document_.getElementById("myList2").lastChild;
        //document_.getElementById("body").appendChild(node);;

        var temp = document_.createElement('div');
        temp.innerHTML = html;
        // var htmlObject = temp.firstChild;
        var body = document.querySelector("body"); //document_.getElementById("body");
        // console.log(body);
        /*
        var lastnode = body.lastChild;
        lastnode.appendChild(temp);
        */
        body.appendChild(temp);


        // Get the modal that is closed
        var modal = document.getElementById('myMiniPanel');
        this.modal = modal;

        // appear
        this.appear();

        var that = this;

        /*
        // Get the button that opens the modal
        //var btn = document.getElementById("myBtn");
        // When the user clicks on the button, open the modal
        btn.onclick = function() {
            this.appear();
        }
        */


        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            that.disappear();
        }

        /*
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                that.disappear();
            }
        }
        */

        this.document_ = document_;

    }
    Visualiser.prototype.appear = function () {
        // this.modal.style.display = "block";
        //this.modal.style.display = "inline";
        this.modal.style.display = "";
    }
    Visualiser.prototype.disappear = function () {
        this.modal.style.display = "none";
    }

    /*
    Visualiser.prototype.register = function (data_accumulator) {
    }
    */
    Visualiser.prototype.update = function (id, data_accumulator) {
        var dom = this.document_.querySelector("#visualiser_content_main");
        var json = JSON.stringify(data_accumulator);
        dom.textContent = json;   // dom.innerHTML = t;
    }

    KLEPTO.Visualiser = Visualiser;

}(window, KLEPTO));
