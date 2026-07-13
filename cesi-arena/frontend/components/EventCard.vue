<script setup>
defineProps([
    'EventImage',
    'EventName',
    'EventLink',
    'EventTagUn',
    'EventTagUnLink',
    'EventTagDeux',
    'EventTagDeuxLink',
    'EventTagTrois',
    'EventStatus'
])
</script>

<template>
    <div class="flex flex-col items-start gap-y-2 min-w-[320px]">
        <NuxtLink
            :to="EventStatus === false ? null : EventLink"
            :class="[
        'shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 w-full bg-neutral-900',
        EventStatus !== false ? 'hover:scale-95  cursor-pointer' : 'cursor-default'
      ]"
        >
            <!-- Image du Jeu -->
            <div
                class="relative min-h-[180px] w-full overflow-hidden"
            >
                <NuxtImg
                    provider="strapi"
                    :src="EventImage"
                    :class="[
                            'absolute top-0 left-0 w-full h-full object-cover transition-all duration-300',
                            EventStatus === false ? 'filter grayscale' : ''
                          ]"
                    alt="Image de l'événement"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div
                    :class="[
            'absolute inset-0 filter transition-all duration-300',
             EventStatus === false ? 'grayscale' : ''
          ]"
                ></div>
            </div>

            <div :class="['p-4 font-bold', EventStatus === false ? 'text-gray-300' : 'text-beige']">
                <h2>{{ EventName }}</h2>
            </div>
        </NuxtLink>

        <!-- Tags en dessous -->
        <div class="flex flex-wrap gap-1">
            <Tag
                :TagName="EventTagUn"
                :TagFontcolor="EventStatus === false ? '#787878' : 'black'"
                :TagBackgroundColor="EventStatus === false ? '#f0f0f0' : '#f5f5dc'"
                :TagUrl="EventTagUnLink"

            />
            <Tag
                :TagName="EventTagDeux"
                :TagFontcolor="EventStatus === false ? '#787878' : 'black'"
                :TagBackgroundColor="EventStatus === false ? '#f0f0f0' : '#f5f5dc'"
                :TagUrl="EventTagDeuxLink"

            />
            <Tag
                :TagName="EventTagTrois"
                :TagFontcolor="EventStatus === false ? '#787878' : 'black'"
                :TagBackgroundColor="EventStatus === false ? '#f0f0f0' : '#f5f5dc'"

            />
            <Tag
                v-if="EventStatus === false"
                TagName="Inscriptions closes"
                TagFontcolor="white"
                TagBackgroundColor="red"

            />
            <Tag
                v-if="EventStatus === true"
                TagName="Inscriptions ouvertes"
                TagFontcolor='white'
                TagBackgroundColor='green'
            />
        </div>
    </div>
</template>
