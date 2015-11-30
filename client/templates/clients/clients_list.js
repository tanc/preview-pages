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
    // Clear any previously stored clientId value.
    $('#clientId').val('');
  },
  'click .edit': function(e) {
    e.preventDefault();
    client = $(e.target).closest('.client');
    clientId = client.attr('data-id');
    if (typeof clientId !== "undefined") {
      var client = Clients.findOne(clientId);
      $('#clientId').val(client._id);
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

    var client = {
      name: $('#clientName').val(),
      url: $('#clientUrl').val().replace(/\W+/g, '-').toLowerCase()
    };

    // Get the clientId from the hidden form field. This will have a value if
    // the form was populated from the edit button.
    var clientId = $('#clientId').val();

    console.log(clientId);

    // Fall back to using the client name for the url.
    if (client.url == '') {
      client.url = client.name.replace(/\W+/g, '-').toLowerCase();
    }

    // Figure out whether this url is unique and if not append a digit to the end.
    var searchContext = {
      '_id': {$ne: clientId}
    };
    client.url = client.url.uniqueUrl(Clients, searchContext);

    if (client.name != '') {
      // Check if there is a clientId in which case this is a new Client.
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