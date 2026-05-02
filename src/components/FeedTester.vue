<template>
  <BRow>
    <!-- Left: Input -->
    <BCol cols="12" md="6">
      <BAlert variant="success" :model-value="true" class="mb-2">
        URL Fetch — The URL is fetched via a server-side proxy.
      </BAlert>
      <div class="input-group mb-2">
        <input
          v-model="feedUrl"
          type="text"
          class="form-control"
          placeholder="https://example.com/feed.xml"
          :disabled="loading"
          @keyup.enter="fetchFeed"
        />
        <BButton variant="outline-primary" @click="fetchFeed" :disabled="loading || !feedUrl">
          <span v-if="loading">Loading...</span>
          <span v-else>Fetch</span>
        </BButton>
      </div>

      <BAlert variant="success" :model-value="true" class="mb-2 mt-4">
        XML Input — Paste RSS/Atom XML directly to parse.
      </BAlert>
      <BFormTextarea
        v-model="xmlInput"
        placeholder="<?xml version=&quot;1.0&quot; ...>"
        rows="10"
        class="code-textarea mb-2"
      />
      <div class="op-btn">
        <BButton variant="outline-primary" @click="parseDirectXml" :disabled="!xmlInput">
          Parse
        </BButton>
      </div>
    </BCol>

    <!-- Right: Result -->
    <BCol cols="12" md="6" class="mt-3 mt-md-0">
      <BAlert v-if="errorMessage" variant="danger" :model-value="true">
        {{ errorMessage }}
      </BAlert>
      <BAlert v-else-if="feedData" variant="info" :model-value="true">
        <span class="badge feed-type-badge me-2">{{ feedData.type }}</span>{{ feedData.items.length }} items
      </BAlert>
      <BAlert v-else variant="dark" :model-value="true">
        Fetch a URL or parse XML to see results.
      </BAlert>

      <div v-if="feedData">
        <div class="feed-header mb-2 p-3">
          <h5 class="mb-1">
            <a v-if="feedData.link" :href="feedData.link" target="_blank" rel="noopener noreferrer" class="feed-title-link">
              {{ feedData.title || '(no title)' }}
            </a>
            <span v-else class="feed-title-text">{{ feedData.title || '(no title)' }}</span>
          </h5>
          <p v-if="feedData.description" class="feed-header-desc mb-0">{{ feedData.description }}</p>
        </div>

        <div ref="feedItemsRef" class="feed-items">
          <div
            v-for="(item, index) in feedData.items"
            :key="index"
            class="feed-item p-2"
          >
            <div class="d-flex align-items-start">
              <span class="feed-item-index me-2">{{ index + 1 }}</span>
              <div class="flex-grow-1 overflow-hidden">
                <div class="feed-item-title">
                  <a v-if="item.link" :href="item.link" target="_blank" rel="noopener noreferrer">
                    {{ item.title || '(no title)' }}
                  </a>
                  <span v-else class="feed-item-title-text">{{ item.title || '(no title)' }}</span>
                </div>
                <div class="mt-1">
                  <span v-if="item.pubDate" class="feed-item-date me-3">{{ item.pubDate }}</span>
                  <span v-if="item.link" class="feed-item-url">{{ item.link }}</span>
                </div>
                <div v-if="item.description" class="feed-item-description mt-1">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BCol>
  </BRow>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { BRow, BCol, BFormTextarea, BButton, BAlert } from 'bootstrap-vue-next'

export default {
  name: 'FeedTester',
  components: {
    BRow,
    BCol,
    BFormTextarea,
    BButton,
    BAlert
  },
  setup() {
    const feedUrl = ref('')
    const xmlInput = ref('')
    const loading = ref(false)
    const errorMessage = ref('')
    const feedData = ref(null)
    const feedItemsRef = ref(null)

    const updateFeedItemsHeight = () => {
      nextTick(() => {
        if (!feedItemsRef.value) return
        const top = feedItemsRef.value.getBoundingClientRect().top
        const available = window.innerHeight - top - 16
        feedItemsRef.value.style.height = Math.max(available, 150) + 'px'
      })
    }

    watch(feedData, updateFeedItemsHeight)

    onMounted(() => {
      window.addEventListener('resize', updateFeedItemsHeight)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateFeedItemsHeight)
    })

    const getChildText = (el, tagName) => {
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i]
        if (child.nodeType === 1 && child.localName === tagName) {
          return child.textContent.trim()
        }
      }
      return ''
    }

    const getChildLink = (el) => {
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i]
        if (child.nodeType !== 1 || child.localName !== 'link') continue
        const rel = child.getAttribute('rel')
        if (!rel || rel === 'alternate') {
          const href = child.getAttribute('href') || child.textContent.trim()
          if (href) return href
        }
      }
      return ''
    }

    const stripHtml = (html) => {
      if (!html) return ''
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      return (tmp.textContent || tmp.innerText || '').trim()
    }

    const safeLink = (url) => {
      if (!url || !/^https?:\/\//i.test(url)) return ''
      return url
    }

    const truncate = (text, max) => {
      if (!text) return ''
      return text.length > max ? text.slice(0, max) + '...' : text
    }

    const parseRss2 = (doc) => {
      const channel = doc.querySelector('channel')
      if (!channel) throw new Error('No channel element found')

      const items = []
      channel.querySelectorAll('item').forEach(item => {
        items.push({
          title: getChildText(item, 'title'),
          link: safeLink(getChildText(item, 'link')),
          pubDate: getChildText(item, 'pubDate'),
          description: truncate(stripHtml(getChildText(item, 'description')), 200)
        })
      })

      return {
        type: 'RSS 2.0',
        title: getChildText(channel, 'title'),
        link: safeLink(getChildText(channel, 'link')),
        description: truncate(stripHtml(getChildText(channel, 'description')), 300),
        items
      }
    }

    const parseRss1 = (doc) => {
      const channel = doc.querySelector('channel')
      if (!channel) throw new Error('No channel element found')

      const items = []
      const root = doc.documentElement
      for (let i = 0; i < root.childNodes.length; i++) {
        const node = root.childNodes[i]
        if (node.nodeType !== 1 || node.localName !== 'item') continue
        let pubDate = ''
        for (let j = 0; j < node.childNodes.length; j++) {
          const child = node.childNodes[j]
          if (child.nodeType === 1 && child.localName === 'date') {
            pubDate = child.textContent.trim()
            break
          }
        }
        items.push({
          title: getChildText(node, 'title'),
          link: safeLink(getChildText(node, 'link')),
          pubDate,
          description: truncate(stripHtml(getChildText(node, 'description')), 200)
        })
      }

      return {
        type: 'RSS 1.0',
        title: getChildText(channel, 'title'),
        link: safeLink(getChildText(channel, 'link')),
        description: truncate(stripHtml(getChildText(channel, 'description')), 300),
        items
      }
    }

    const parseAtom = (doc) => {
      const feed = doc.documentElement
      const feedLink = safeLink(getChildLink(feed))

      const items = []
      for (let i = 0; i < feed.childNodes.length; i++) {
        const entry = feed.childNodes[i]
        if (entry.nodeType !== 1 || entry.localName !== 'entry') continue

        const itemLink = safeLink(getChildLink(entry))
        const descRaw = getChildText(entry, 'summary') || getChildText(entry, 'content')

        items.push({
          title: getChildText(entry, 'title'),
          link: itemLink,
          pubDate: getChildText(entry, 'published') || getChildText(entry, 'updated'),
          description: truncate(stripHtml(descRaw), 200)
        })
      }

      return {
        type: 'Atom',
        title: getChildText(feed, 'title'),
        link: feedLink,
        description: truncate(stripHtml(getChildText(feed, 'subtitle')), 300),
        items
      }
    }

    const parseFeed = (xmlString) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlString, 'application/xml')

      if (doc.querySelector('parsererror') || doc.documentElement.localName === 'parsererror') {
        throw new Error('Invalid XML: parse error')
      }

      const rootName = doc.documentElement.localName

      if (rootName === 'feed') return parseAtom(doc)
      if (rootName === 'rss') return parseRss2(doc)
      if (rootName === 'RDF') return parseRss1(doc)

      throw new Error(`Unknown feed format: <${rootName}>`)
    }

    const fetchFeed = async () => {
      if (!feedUrl.value || loading.value) return

      loading.value = true
      errorMessage.value = ''
      feedData.value = null

      try {
        const apiUrl = import.meta.env.VITE_APP_FEED_API || './feed.php'
        const params = new URLSearchParams({ url: feedUrl.value })
        const response = await fetch(`${apiUrl}?${params}`)

        if (!response.ok) {
          const text = await response.text()
          throw new Error(`HTTP ${response.status}: ${text}`)
        }

        feedData.value = parseFeed(await response.text())
      } catch (e) {
        errorMessage.value = e.message
      } finally {
        loading.value = false
      }
    }

    const parseDirectXml = () => {
      errorMessage.value = ''
      feedData.value = null
      try {
        feedData.value = parseFeed(xmlInput.value)
      } catch (e) {
        errorMessage.value = e.message
      }
    }

    return {
      feedUrl,
      xmlInput,
      loading,
      errorMessage,
      feedData,
      feedItemsRef,
      fetchFeed,
      parseDirectXml
    }
  }
}
</script>

<style scoped>
.feed-type-badge {
  background-color: #3399cc !important;
  color: #fff !important;
}

/* Feed header */
.feed-header {
  background-color: rgba(51, 153, 204, 0.12);
  border: 1px solid rgba(51, 153, 204, 0.35);
  border-left: 4px solid #3399cc;
  border-radius: 4px;
}

.feed-title-link {
  color: #ffffff !important;
  text-decoration: none;
  font-weight: bold;
}
.feed-title-link:hover {
  color: #ffcc66 !important;
  text-decoration: underline;
}
.feed-title-text {
  color: #ffffff;
  font-weight: bold;
}

.feed-header-desc {
  color: #90afc0;
}

/* Items list */
.feed-items {
  overflow-y: auto;
  min-height: 150px;
}

.feed-item {
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-bottom: 4px;
}
.feed-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 204, 102, 0.3);
}

.feed-item a {
  color: #ffcc99 !important;
  text-decoration: none;
}
.feed-item a:hover {
  color: #ffdd66 !important;
  text-decoration: underline;
}
.feed-item-title-text {
  color: #e0e0e0;
}

.feed-item-index {
  min-width: 2em;
  text-align: right;
  color: #3399cc;
  font-weight: bold;
  padding-top: 2px;
}

.feed-item-date {
  color: #7fc4e4;
}

.feed-item-url {
  color: #6a8fa8;
  word-break: break-all;
}

.feed-item-description {
  color: #9ab0be;
}
</style>
