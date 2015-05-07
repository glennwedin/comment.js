(function (window, document, undefined) {
	'use strict';
    
    //Model
    var CommentModel = function () {
    	this.shouldFade = false;
    	this.comment = null;
	};
    
    //View
    var CommentView = function (commentmodel) {
        var comment = commentmodel.comment;
        
        this.render = function () {
            var element = document.createElement('div');
            element.innerHTML = '<div class="" style="float:left;"><div class="name">'+comment.author+'</div><div class="date">'+comment.date+'</div></div><div class="replylink">Reply</div><div class="c" style="clear:both;">'+comment.comment+'</div>';
            element.className = 'comment';
            if(comment.admin == 1) {
            	element.className +=' admin';
			}
            element.setAttribute('data-id', comment.id);
            this.el = element;
            
            return this;
        }
    };
    
    //Collection
    var CommentList = function (scope) {
        var comments = [],
            listeners = [];
        
        this.addComment = function (comment) {
            comments.push(comment);
            var lLength = listeners.length;
            
            while(lLength--) {
                listeners[lLength].renderComment(comment);
            }
            return true;
        }
        
        this.removeComment = function (id) {
        	var lLength = listeners.length,
        	i = 0;
        	
        	for(i; i < comments.length; i++) {
        		if(comments[i].comment.id == id) {
        			comments.splice(i, 1);
        			return true;
				}
			}
			return false;
		}
        
        
        this.getComments = function () {
            return comments;
        }
        
        this.listen = function (scope) {
            listeners.push(scope);
        }
    };
    
    //Kommentarmodulen
    var Comment = function (el) {
        this.elementlist = document.querySelectorAll(el);
        this.elLength = this.elementlist.length;
        this.written_by = "http://wedinweb.no"
        
        //Liste med observer
        this.commentsList = new CommentList(this);
        this.commentsList.listen(this); 
    }
    
    //Ikke-unike metoder
    Comment.prototype = {

        bootstrapComments: function (json) {
            var x = 0, c,
                comment;
                for(x; x < json.comments.length; x++) { 
                    c = new CommentModel();
                    c.comment = json.comments[x];
                    this.commentsList.addComment(c, false);
                }
        },
        
        renderComment: function (comment) {
            var i = this.elLength, 
                v, c,
                th = this,
                wrapper;
              
            while(i--) {
                v = new CommentView(comment);
                c = v.render();
				
                wrapper = document.createElement('div');
                wrapper.appendChild(c.el);
                wrapper.className = "commentwrap";
                wrapper.setAttribute('data-id', comment.comment.id);
				
                if(comment.comment.reply_id) {
                	var els = th.elementlist[i].querySelectorAll('[data-id]'),
                	elLen = els.length;
                	while(elLen--) {
                		var id = els[elLen].getAttribute('data-id');
                		if(id == comment.comment.reply_id) {
							els[elLen].appendChild(wrapper);
						}
					}
				} else {
                	th.elementlist[i].appendChild(wrapper);
				}

            	if(comment.shouldFade) {
					c.el.className += ' fade';
					setTimeout(function () {
						c.el.className = c.el.className.replace(/\bfade\b/,'');
					}, 100);
				}
            }
        },
        
        addComment: function (comment) {
            var c = new CommentModel();
            c.comment = comment;
            c.shouldFade = true;
            this.commentsList.addComment(c);
        },
        
        removeComment: function (id) {
        	var th = this,
        	elmnts = th.elementlist[0].querySelectorAll('.comment'),  //må loope over alle i elementslist gjelde alle
        	i = 0;

        	if(th.commentsList.removeComment(id)) {
				for(i; i < elmnts.length; i++) {
					console.log(elmnts[i].getAttribute('data-id'))
					if(elmnts[i].getAttribute('data-id') == id) {
						elmnts[i].innerHTML = "Comment has been deleted";
					}
				}
			}
		}
    }
    
    window.Comment = Comment;
    
}(window, document, undefined));