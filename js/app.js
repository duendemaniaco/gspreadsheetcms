window.windowCreated = new Date();

var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=0AuHY3zxskdHedDdnSnVYT21oY21KVjkyRDQweTJfR1E&output=html';

$(document).ready(function() {
    window.docCreated = new Date();
    Tabletop.init( { 
        key: public_spreadsheet_url,
        callback: buildApp
    });

    // the templates are inline, so let's compile 'em. 
    // TODO: CDN and precompiled.
    window.tplNav = Handlebars.compile($("#tplNav").html());
    window.tplTitle = Handlebars.compile($("#tplTitle").html());
    window.tplPage = Handlebars.compile($("#tplPage").html());    
});

function buildApp( data, tabletop ) {
    window.dataCreated = new Date();

    console.log(tabletop);
    var pages = [];
    tabletop.models.pages.elements.forEach(function(page) {
        pages.push(page);
    });
    
    // build header HTML
    var navHtml = tplNav({
        pages: pages,
    });

    //console.log(headerHtml);

    $("header").html(navHtml);

    window.pagesHtml = {};
    window.titleHtml = {};
    pages.forEach(function(page) {
        var pageContentList = page.content.split("\n");
        page.contentFormatted = pageContentList.join("<br>\n");
        //console.log(page);
        pagesHtml[page.slug] = tplPage(page);       

        titleHtml[page.slug] = tplTitle(page);
    });


    // spin up the router from backbone to switch out the main div on hash changes
    var AppRouter = Backbone.Router.extend({
        routes: {
            "!/*route": "defaultRoute",
            "*route": "defaultRoute" //TODO: is there a cleaner way to do this?
        },
        defaultRoute: function(route) {
            if (route == '') route = 'home'; //TODO: this is a hack. should it be the first page in the model?
            $("nav li").removeClass('active')
            $("#"+route).addClass('active');

            console.log(titleHtml[route]);
            $("#title").html( titleHtml[route] )
            $("#content").html( pagesHtml[route] );
        }
    });

    var app = new AppRouter;
    Backbone.history.start();

    // more timing metrics, just curious on load time
    // because the page is empty until this is done...
    window.contentCreated = new Date();
    window.loadingPerformance = [docCreated-windowCreated, dataCreated-windowCreated, contentCreated-windowCreated];

    //TODO: send this back to the server to gauge how slow it really is.
    //if (console) //console.log(loadingPerformance);
}
