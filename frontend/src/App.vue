<template>
	<v-app>
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