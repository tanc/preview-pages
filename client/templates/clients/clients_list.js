Template.clientsList.helpers({
  clients: function() {
    return Clients.find({}, {sort: {name: 1}});
  }
});

Template.clientsList.events({
  'click .add-new-client': function(e) {
    e.preventDefault();
    $('#editmodal').modal('show');
    $('.form-control').val('');
    $('.form-group').removeClass('has-success');
  },
  'click .edit': function(e) {
    e.preventDefault();
    client = $(e.target).closest('.client');
    clientId = client.attr('data-id');
    if (typeof clientId !== "undefined") {
      var client = Clients.findOne(clientId);
      $('#clientName').val(client.name);
      $('#clientUrl').val(client.url);
    }
    $('.form-group').removeClass('has-success');
    ModalHelper.openModalFor(clientId);
  }
});

Template.editModalClientTemplate.events({
  'submit form': function(event) {

    event.preventDefault();

    var clientId = Session.get('selectedItemId');

    var client = {
      name: $('#clientName').val(),
      url: $('#clientUrl').val().replace(/\W+/g, '-').toLowerCase(),
      _clientId: this._id
    };

    // Fall back to using the client name for the url.
    if (client.url == '') {
      client.url = client.name.replace(/\W+/g, '-').toLowerCase();
    }

    if (client.name != '') {
      if (!clientId) {
        Meteor.call('addClient', client, function (error, result) {
          if (error) {
            alert(error);
          }
        });
      }
      else {
        _.extend(client, {id: clientId});
        Meteor.call('editClient', client, function(error, result) {
          if (error) {
            alert(error);
          }
        });
      }

      $('#editmodal').modal('hide');
    }
  }
});