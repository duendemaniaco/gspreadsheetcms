// **This example illustrates the declaration and instantiation of a minimalist View.**

// Self-executing wrapper
(function($){
    Backbone.sync = function(method, model, success, error){
        success();  
    };

    var Note = Backbone.Model.extend({
        defaults: {
            text: 'Write something here'
        }
    });

    var List = Backbone.Collection.extend({
        model: Note
    });
    
    var NoteView = Backbone.View.extend({
        tagName: 'article',

        events: {
            'click span.delete': 'remove',
            //'dblclick span.note' : 'edit'
        },

        initialize: function() {
            _.bindAll(this, 'render', 'unrender', 'remove');

            this.model.bind('change', this.render);
            this.model.bind('remove', this.unrender);
        },

        render: function() {
            var template = _.template( $("#note_template").html(), {text: this.model.get('text')} );
            $(this.el).html(template);
            $(this.el).addClass("note");
            $(this.el).attr('draggable','true');
            $(this.el).attr("ondragstart","handleDragStart(event)");
            console.log($(this.el).context.style);
            $(this.el).context.style.top = Math.floor((Math.random()*80)+10) + "%" ;
            $(this.el).context.style.left = Math.floor((Math.random()*90)+1) + "%" ;
            return this;
        },

        unrender: function() {
            $(this.el).remove();
        },

        remove: function() {
            this.model.destroy();
        }
    });

    var ListView = Backbone.View.extend({    
        el: $('#main'), 

        events: {
            'keypress #new-note': 'createNote'
        },

        initialize: function(){
            _.bindAll(this, 'render', 'addNote', 'createNote','appendNote'); 

            this.collection = new List();
            this.collection.bind('add', this.appendNote);
        
            this.counter = 0;
            this.render(); 
        },

        render: function(){
            var self = this;
            $(this.el).append("<div></div>");
            _(this.collection.models).each(function(note){
                self.appendNote(note);
            }, this);
        },

        addNote: function(text){
            this.counter++;
            var note = new Note();
            
            note.set({
                text: text
            });
            this.collection.add(note);
        },

        createNote: function(e){
            if (e.keyCode != 13) return;
            if (!$("#new-note").val()) return;
            
            this.addNote($("#new-note").val());

            $("#new-note").val('');
        },

        appendNote: function(note){
            var noteView = new NoteView({
                model: note
            });
            $('div', this.el).append(noteView.render().el);
        }
    });

    var listView = new ListView();      
})(jQuery);

// <script>
//   if (window.location.href.search(/\?x/) < 0) {
//     var _gaq = _gaq || [];
//     _gaq.push(['_setAccount', 'UA-924459-7']);
//     _gaq.push(['_trackPageview']);
//     (function() {
//       var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//       ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
//       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
//     })();
//   }
// </script>
