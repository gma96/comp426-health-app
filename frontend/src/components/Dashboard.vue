<template>
  <v-container
    fluid
    style="min-height: 0;"
    grid-list-lg
    id="dashboard"
    fill-height
  >
    <v-layout column>
      <v-flex xs12 sm12 md12 lg12>
        <v-card color="blue-grey darken-2" class="white--text">
          <v-card-title primary-title>
            <div class="headline">Unlimited music now</div>
            <div>Listen to your favorite artists and albums whenever and wherever, online and offline.</div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat dark>Listen now</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-card color="cyan darken-2" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Supermodel</div>
                  <div>Foster the People</div>
                </div>
              </v-flex>
              <v-flex xs5>
                <v-card-media
                  src="/static/doc-images/cards/foster.jpg"
                  height="125px"
                  contain
                ></v-card-media>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-card color="purple" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Halycon Days</div>
                  <div>Ellie Goulding</div>
                </div>
              </v-flex>
              <v-flex xs5>
                  <v-card-media
                    src="/static/doc-images/cards/halcyon.png"
                    height="125px"
                    contain
                  ></v-card-media>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-card color="purple" class="white--text">
          <v-container fluid grid-list-lg>
            <v-layout row>
              <v-flex xs7>
                <div>
                  <div class="headline">Halycon Days</div>
                  <div>Ellie Goulding</div>
                </div>
              </v-flex>
              <v-flex xs5>
                  <v-card-media
                    src="/static/doc-images/cards/halcyon.png"
                    height="125px"
                    contain
                  ></v-card-media>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>