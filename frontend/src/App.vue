<template>
	<v-app v-bind:class="this.$route.path.trim().replace(/^\//i,'').split('/').join('-')">
	  <v-content>
	    <v-container fill-height>
	    	<router-view/>
	    </v-container>
	  </v-content>
	</v-app>
</template>

<script>
export default {
  name: 'app'
}
</script>