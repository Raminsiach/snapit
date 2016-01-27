(function($, document) {
	var settings = {
    	speed: 1000
    },
    	locations = [],
    	elements = [],
    	idx = 0,
    	lock = false,
    	scrollSamples = [],
    	scrollTime = new Date().getTime();
    
    var context = this;
    
    var animate = function(idx) {
    	$('body').stop().animate({scrollTop: locations[idx]}, settings.speed);
    	$('body').promise().done(function() {
    		lock = false;
    		console.log('unlocking');
    	})
    }
    function atTop() {
		top = $(window).scrollTop();
		if(top>parseInt(locations[idx])) {
			return false;
		} else {
			return true;
		}
	}
	function atBottom() {
		top = $(window).scrollTop();
		if(top<parseInt(locations[idx])+(elements[idx].height()-$(window).height())) {
			return false;
		} else {
			return true;
		}
	}
    function isAccelerating(samples) {

        if(samples<4) {
        	return false;
        }
        var limit = 20,sum = 0,i = samples.length-1,l;
        if(samples.length<limit*2) {
        	limit = Math.floor(samples.length/2);
        }
        l = samples.length-limit;
        for(;i>=l;i--) {
        	sum = sum+samples[i];
        }
        var average1 = sum/limit;

        sum = 0;
        i = samples.length-limit-1;
        l = samples.length-(limit*2);
        for(;i>=l;i--) {
        	sum = sum+samples[i];
        }
        var average2 = sum/limit;

        if(average1>=average2) {
        	return true;
        } else {
        	return false;
        }
	}

	$.fn.snapit = function(options) {
    	settings = $.extend(settings, options);
        
        var fetchLocations = function() {
    	this.each(function(i) {
	    		locations.push($(this).offset().top);
	    		elements[i] = $(this);
	    	});
	    }.bind(this);

	    var activateKeyNav = function(event) {
	    	if(event.which === 40) {
	    		if(idx < locations.length - 1) {
	    			animate(++idx);
	    			console.log('down');
	    		}
	    	} else if(event.which === 38) {
	    		if(idx > 0) {
	    			animate(--idx);
	    			console.log('up');
	    		}
	    	}
	    	
	    }
	    var activateWheelNav = function(event) {
	    	event.preventDefault();
	    	if(lock)
	    		return false;
	    	var currentScrollTime = new Date().getTime();
			var delta = -event.originalEvent.detail / 3 || event.originalEvent.wheelDelta / 120;

			
			if((currentScrollTime-scrollTime) > 1300){
				scrollSamples = [];
			}
			scrollTime = currentScrollTime;

			if(scrollSamples.length >= 35){
				scrollSamples.shift();
			}
			scrollSamples.push(Math.abs(delta*10));

	    	if(delta < 0) {
	    		if(idx < locations.length - 1) {
	    			if(atBottom()) {
		    			if(isAccelerating(scrollSamples)) {
		    				console.log('down')
			    			lock = true;
			    			animate(++idx);	
		    			} else return false;
		    		}
	    			
	    		}
	    	} else if(delta > 0) {
	    		if(idx > 0) {
	    			if(atTop()) {
	    				if(isAccelerating(scrollSamples)) {
		    				console.log('up');
			    			lock = true;
			    			animate(--idx);	
		    			} else return false;
	    			}
	    			
	    			
	    		}
	    	}
	    }

	    fetchLocations();
	    $(document).bind('keyup', activateKeyNav);
	    $(document).bind('DOMMouseScroll mousewheel',activateWheelNav);
        

        
    };
}(jQuery, document));