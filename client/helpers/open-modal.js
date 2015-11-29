ModalHelper = {};

ModalHelper.openModalFor = function(pageId) {
  Session.set('selectedItemId', pageId);
  $('#editmodal').modal('show');
};