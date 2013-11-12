/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
$(function () {
    var Contact = Backbone.Model.extend({
        defaults: {
            name: "",
            email: "",
            selected: false
        }
    });
    var ContactList = Backbone.Collection.extend({
        model: Contact,
        localStorage: new Backbone.LocalStorage("contacts-backbone")
    });
    var ContactDetailView = Backbone.View.extend({
        template: _.template($("#contact-detail-template").html()),
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
    });
    var ContactView = Backbone.View.extend({
        template: _.template($("#contact-template").html()),
        events: {
            "click .delContact": "delContact",
            "click .contactListItem": "selectContact"
        },
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        delContact: function () {
            this.model.destroy();
        },
        selectContact: function () {
            this.model.trigger('contactClicked', this.model);
        }
    });
    var AppView = Backbone.View.extend({
        el: $("#appContainer"),
        events: {
            "click #addContact": "addContact"
        },
        initialize: function () {
            this.contacts = new ContactList;
            this.listenTo(this.contacts, 'add', this.addOne);
            this.contacts.fetch();
        },
        render: function () {
        },
        contactClicked: function (contact) {
            var detailView = new ContactDetailView({model: contact});
            $("#contactDetailContainer").html(detailView.render().el);
        },
        addOne: function (contact) {
            contact.on('contactClicked', this.contactClicked, this);
            var listView = new ContactView({model: contact});
            $("#listContainer").append(listView.render().el);
        },
        addContact: function () {
            var name = $("#contactName").val();
            var email = $("#contactEmail").val();
            this.contacts.create({name: name, email: email});
            $("contactName").val("");
            $("contactEmail").val("");
        }
    });
    
    var appView = new AppView;
}); 