<template>   
   <v-container row fluid flex>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-list two-line>
          <template v-for="item in items">
            <v-subheader v-if="item.header" v-text="item.header"></v-subheader>
            <v-divider v-else-if="item.divider" v-bind:inset="item.inset"></v-divider>
            <v-list-tile avatar v-else v-bind:key="item.title" @click="">
              <v-list-tile-avatar>
                <img v-bind:src="item.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-container>
</template>
<script>
 export default {
  mounted () {
    Rest.routes.user.login({data:{
    email: 'prestonrobinson@me.com',
    password: 'leah',
    }}).then((res) => {
    let data = res.data.data;
    console.log(data[0])
    if(data[0].token) Rest.setToken(data[0].token);
    }).catch((e) =>{console.log(e)})
  },
    data () {
      return {
        items: [
          { header: 'Mindfulness frees the mind' },
          { avatar: 'https://next.vuetifyjs.com/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "<span class='text--primary'>Ali Connors</span> — I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
          { divider: true, inset: true },
          { avatar: 'https://next.vuetifyjs.com/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> — Wish I could come, but I'm out of town this weekend." },
          { divider: true, inset: true },
          { avatar: 'https://next.vuetifyjs.com/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "<span class='text--primary'>Sandra Adams</span> — Do you have Paris recommendations? Have you ever been?" }
        ]
      }
    }
  }
</script>