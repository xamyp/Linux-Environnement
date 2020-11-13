var prefs = (function () {
  'use strict';

  var Gio2_0 = imports.gi.Gio;

  var Gtk3_0 = imports.gi.Gtk;

  const ExtensionUtils = imports.misc.extensionUtils;
  function init() { }
  function buildPrefsWidget() {
      let prefs = new PrefsWidget();
      return prefs.widget;
  }
  class PrefsWidget {
      constructor() {
          // Init gsettings
          let gschema = Gio2_0.SettingsSchemaSource.new_from_directory(ExtensionUtils.getCurrentExtension().dir.get_child('schemas').get_path(), Gio2_0.SettingsSchemaSource.get_default(), false);
          let settings_schema = gschema.lookup('net.evermiss.mymindstorm.volume-mixer', true);
          if (!settings_schema) {
              throw "Settings schema not found!";
          }
          this.settings = new Gio2_0.Settings({
              settings_schema
          });
          this.ignoreListData = this.settings.get_strv("ignored-streams");
          // Create UI
          this.builder = Gtk3_0.Builder.new_from_file(ExtensionUtils.getCurrentExtension().dir.get_child('prefs.glade').get_path());
          this.widget = this.builder.get_object("prefs-box");
          this.ignoreList = this.builder.get_object("stream-ignore-list");
          this.builder.connect_signals_full((builder, object, signal, handler) => {
              object.connect(signal, this[handler].bind(this));
          });
          const showDescSwitch = this.builder.get_object("show-desc-switch");
          this.settings.bind('show-description', showDescSwitch, 'active', Gio2_0.SettingsBindFlags.DEFAULT);
          // Load ignored into list
          for (const ignored of this.ignoreListData) {
              this.ignoreList.insert(this.buildIgnoreListItem(ignored), 0);
          }
          this.widget.show_all();
      }
      showAddIgnoreDiag() {
          this.diag = this.builder.get_object("add-ignore-diag");
          this.diag.show_all();
      }
      hideAddIgnoreDiag() {
          var _a;
          const ignoreAppEntry = this.builder.get_object("ignore-diag-input");
          ignoreAppEntry.set_text("");
          (_a = this.diag) === null || _a === void 0 ? void 0 : _a.hide();
      }
      addIgnoreStream() {
          const ignoreAppEntry = this.builder.get_object("ignore-diag-input");
          if (this.ignoreListData.indexOf(ignoreAppEntry.get_text()) !== -1) {
              this.hideAddIgnoreDiag();
              return;
          }
          this.ignoreListData.push(ignoreAppEntry.get_text());
          this.ignoreList.insert(this.buildIgnoreListItem(ignoreAppEntry.get_text()), 0);
          this.settings.set_strv("ignored-streams", this.ignoreListData);
          this.hideAddIgnoreDiag();
      }
      deleteIgnoreStream(application, listItem) {
          this.ignoreListData.splice(this.ignoreListData.indexOf(application), 1);
          listItem.destroy();
          this.settings.set_strv("ignored-streams", this.ignoreListData);
      }
      buildIgnoreListItem(name) {
          const listRow = new Gtk3_0.ListBoxRow({ activatable: false });
          const box = new Gtk3_0.HBox({
              margin_start: 10,
              margin_end: 10,
              margin_top: 5,
              margin_bottom: 5
          });
          box.pack_start(new Gtk3_0.Label({ label: name }), false, true, 0);
          const removeButton = new Gtk3_0.Button();
          removeButton.add(new Gtk3_0.Image({ icon_name: "window-close-symbolic" }));
          removeButton.connect("clicked", (button) => this.deleteIgnoreStream(name, listRow));
          box.pack_end(removeButton, false, true, 0);
          listRow.add(box);
          listRow.show_all();
          return listRow;
      }
  }
  var prefs = {
      init,
      buildPrefsWidget
  };

  return prefs;

}());
var init = prefs.init;
var buildPrefsWidget = prefs.buildPrefsWidget;
