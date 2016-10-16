var KLEPTO = KLEPTO || {};

(function(win, KLEPTO){
    'use strict';

    function Visualiser(document_) {
        this.setup(document_, win);
        this.document_ = document_;
    }

    Visualiser.prototype.setup = function (document_, window_) {


        var html = `<!-- The Modal -->
        <div>
            <div class="visualiser_panel" id=myMiniPanel>
            <span class="close">&#10006;</span>
            <div id=visualiser_content_main>
            (please wait)
            </div>
            </div>
        </div>`;

        var dom = document_.querySelector("#visualiser_content_main");
        if (dom) {
            console.error("Already added.");
            return;
        }

        var temp = document_.createElement('div');
        temp.innerHTML = html;
        var body = document.querySelector("body"); //document_.getElementById("body");
        body.appendChild(temp);


        // Get the modal that is closed
        var modal = document.getElementById('myMiniPanel');
        this.modal = modal;

        this.appear();

        // Make a reference to "this" in the closure
        var that = this;

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            that.disappear();
        }


        /*
        // The button that opens the modal
        //var btn = document.getElementById("myBtn");
        // When the user clicks on the button, open the modal
        btn.onclick = function() {
            that.appear();
        }
        */


        /*
        // Modal only:
        // When the user clicks anywhere outside of the modal, close it
        window_.onclick = function(event) {
            if (event.target == modal) {
                that.disappear();
            }
        }
        */
    }
    Visualiser.prototype.appear = function () {
        // this.modal.style.display = "block";
        //this.modal.style.display = "inline";
        this.modal.style.display = "";
    }
    Visualiser.prototype.disappear = function () {
        this.modal.style.display = "none";
    }

    Visualiser.prototype.update = function (id, data_accumulator) {
        var dom = this.document_.querySelector("#visualiser_content_main");
        var json = JSON.stringify(data_accumulator);
        dom.textContent = json;   // dom.innerHTML = t;
    }

    KLEPTO.Visualiser = Visualiser;

}(window, KLEPTO));
