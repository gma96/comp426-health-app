<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      clipped
      app
      v-model="drawer"
      v-if="store.state.isAuthed"
    >
      <v-list dense>
        <template v-for="(item, i) in items">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="i"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" v-model="item.model" no-action>
            <v-list-tile slot="item" @click="" ripple>
              <v-list-tile-action>
                <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <!-- drawer_nav_el -->
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click=""
              ripple
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
           <!-- /drawer_nav_el -->
          </v-list-group>
          <!-- standard_tile -->
          <v-list-tile v-else @click="" ripple :to="{path: item.path}" exact>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="blue darken-3 brand-primary--gradient"
      dark
      app
      clipped-left
      fixed
    >
      <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-xs-only"><v-icon>favorite</v-icon> MyHealth</span>
      </v-toolbar-title>
      <v-text-field
        light
        solo
        prepend-icon="search"
        placeholder="Search"
        style="max-width: 500px; min-width: 128px"
      ></v-text-field>
      <div class="d-flex align-center" style="margin-left: auto">
        <v-btn icon>
          <v-icon>apps</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>notifications</v-icon>
        </v-btn>
        <v-btn icon large>
          <v-avatar size="32px" tile>
            <img
              src="https://vuetifyjs.com/static/doc-images/logo.svg"
              alt="Vuetify"
            >
          </v-avatar>
        </v-btn>
      </div>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height >
         <router-view />
      </v-container>
      <v-btn
      fab
      bottom
      left
      color="pink"
      dark
      fixed
      @click.stop="toggleAuthed"
    >
      <v-icon>add</v-icon>
    </v-btn>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data() {return{
      dialog: false,
      drawer: null,
      store: this.$store,
      items: [
        { icon: 'dashboard', text: 'Dashboard', path:'/'},
        { icon: 'brightness_7', text: 'Mindfulness', path:'/mindfulness'},
        { icon: 'airline_seat_individual_suite', text: 'Sleep', path:'/sleep' },
        { icon: 'opacity', text: 'Water Intake', path:'/water-intake' },
        { icon: 'cake', text: 'Weight', path:'/weight' },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Labels',
          model: true,
          children: [
            { icon: 'add', text: 'Create label' }
          ]
        },
        {
          icon: 'keyboard_arrow_up',
          'icon-alt': 'keyboard_arrow_down',
          text: 'More',
          model: false,
          children: [
            { text: 'Import' },
            { text: 'Export' },
            { text: 'Print' },
            { text: 'Undo changes' },
            { text: 'Other contacts' }
          ]
        },
        { icon: 'settings', text: 'Settings', path:'/settings' },
        // { icon: 'chat_bubble', text: 'Send feedback' },
        // { icon: 'help', text: 'Help' },
        // { icon: 'phonelink', text: 'App downloads' },
        // { icon: 'keyboard', text: 'Go to the old version' }
      ]
    }},
    props: {
      source: String
    },
    methods: {
      toggleAuthed: function () {
        this.store.commit('increment');
        this.store.commit('toggleAuth');
        console.log(this.store.state.count)
        console.log(this.store.state.isAuthed)
        console.log(this.store);
      },
    }
  }
</script>