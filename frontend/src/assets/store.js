const store = {
  debug: true,
  state: {
    isAuthed: true,
  },
  setAuthed: function(bool) {
    if (this.debug) console.log('Authed Uodated');
    this.state.isAuthed =  bool ? true : false;
    console.log(this.state.isAuthed);
  },
};

export default store;
