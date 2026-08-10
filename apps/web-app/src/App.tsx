// import { useEffect, useRef, useState } from "react";
// import { useMedia } from "media-react";
// import { Grid, Lightbox, Reel } from "media-ui-react";

// export default function App() {
//   const sdk = useMedia();

//   const [images, setImages] = useState<any[]>([]);
//   const [videos, setVideos] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [query, setQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");

//   const [page, setPage] = useState(1);
//   const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

//   const loadMoreRef = useRef<HTMLDivElement | null>(null);



//   // 🔥 LOAD DATA (curated + popular)
//   async function loadData() {
//     try {
//       setLoading(true);

//       const photoRes = await sdk.curated(page);
//       const videoRes = await sdk.videos.popular(page);

//       if (page === 1) {
//         setImages(photoRes?.photos || []);
//         setVideos(videoRes?.videos || []);
//       } else {
//         setImages((prev) => [...prev, ...(photoRes?.photos || [])]);
//         setVideos((prev) => [...prev, ...(videoRes?.videos || [])]);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // 🔥 SEARCH DATA
//   async function searchData(q: string) {
//     try {
//       setLoading(true);

//       const photoRes = await sdk.search(q, page);
//       const videoRes = await sdk.videos.search(q, page);

//       if (page === 1) {
//         setImages(photoRes?.photos || []);
//         setVideos(videoRes?.videos || []);
//       } else {
//         setImages((prev) => [...prev, ...(photoRes?.photos || [])]);
//         setVideos((prev) => [...prev, ...(videoRes?.videos || [])]);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//  // 🔥 INITIAL LOAD
//   useEffect(() => {
//     loadData();
//   }, []);



//   // 🔥 DEBOUNCE
// useEffect(() => {
//   const timer = setTimeout(() => {
//     setPage(1);
//     setDebouncedQuery(query);
//   }, 500);

//   return () => clearTimeout(timer);
// }, [query]);

//   // 🔥 RESET DATA ON NEW SEARCH

// useEffect(() => {
  
//   if (page === 1) {
//     setImages([]);
//     setVideos([]);
//   }
// }, [debouncedQuery]);

//   // 🔥 FETCH BASED ON QUERY + PAGE
//   useEffect(() => {
//     if (!debouncedQuery.trim()) {
//       loadData();
//     } else {
//       searchData(debouncedQuery);
//     }
//   }, [debouncedQuery, page]);

//   // 🔥 INFINITE SCROLL
//   useEffect(() => {
//     if (!loadMoreRef.current) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];

//         if (entry.isIntersecting && !loading) {
//           setPage((prev) => prev + 1);
//         }
//       },
//       {
//         rootMargin: "200px",
//       }
//     );

//     observer.observe(loadMoreRef.current);

//     return () => observer.disconnect();
//   }, [loading]);

//   // 🔥 REEL DATA
//   const reelItems = videos.map((v: any) => ({
//     id: v.id,
//     videoUrl: v.videoUrl?.replace(/[[]]/g, ""),
//   }));

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Media SDK</h2>

//       {/* SEARCH */}
     
// <div
//   style={{
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     padding: "12px 16px",
//     borderRadius: "14px",
//     background: "rgba(255,255,255,0.9)",
//     backdropFilter: "blur(10px)",
//     boxShadow:
//       "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
//     border: "1px solid rgba(0,0,0,0.05)",
//     transition: "all 0.25s ease",
//   }}
// >
//   <input
//      type="text"
//         placeholder="Search images & videos..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//     style={{
//       flex: 1,
//       background: "transparent",
//       border: "none",
//       outline: "none",
//       color: "#111827",
//       fontSize: "15px",
//       fontWeight: 500,
//       caretColor: "#6366f1",
//       fontFamily: "inherit",
//       letterSpacing: "0.2px",
//     }}
//   />
// </div>
      

//       {loading && <p>Loading...</p>}

//       {/* IMAGES */}
//       <h3>Images</h3>

//       <Grid
//         items={images}
//         renderItem={(photo: any) => (
//           <img
//             src={photo.src?.medium}
//             loading="lazy"
//             onClick={() => {
//               const index = images.findIndex((p) => p.id === photo.id);
//               setSelectedIndex(index);
//             }}
//             style={{
//               width: "100%",
//               borderRadius: 10,
//               cursor: "pointer",
//             }}
//           />
//         )}
//       />

//       {/* LOAD MORE TRIGGER */}
//       <div ref={loadMoreRef} style={{ height: 20 }} />

//       {/* REELS */}
//       <h3 style={{ marginTop: 40 }}>Reels</h3>

//       {reelItems.length > 0 ? (
//         <Reel items={reelItems} />
//       ) : (
//         <p>No videos available</p>
//       )}

//       {/* LIGHTBOX */}
//       {selectedIndex !== null && (
//         <Lightbox
//           items={images.map((p: any) => ({
//             id: p.id,
//             imageUrl: p.src?.large,
//           }))}
//           selectedIndex={selectedIndex}
//           isOpen={true}
//           onClose={() => setSelectedIndex(null)}
//         />
//       )}
//     </div>
//   );
// }


import { useEffect, useRef, useState, useCallback } from "react";
import { useMedia } from "media-react";
import { Grid, Lightbox, Reel } from "media-ui-react";

export default function App() {
  const sdk: any = useMedia();

  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [page, setPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);
  // ✅ FIX 1: Track loading in a ref so the observer never closes over stale state
  const loadingRef = useRef(false);

  // ✅ FIX 2: Single unified fetch function — resets or appends based on `currentPage`
  const fetchData = useCallback(
    async (q: string, currentPage: number) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        let photoRes, videoRes;

        if (!q.trim()) {
          [photoRes, videoRes] = await Promise.all([
            sdk.curated(currentPage),
            sdk.videos.popular(currentPage),
          ]);
        } else {
          [photoRes, videoRes] = await Promise.all([
            sdk.search(q, currentPage),
            sdk.videos.search(q, currentPage),
          ]);
        }

        const newPhotos = photoRes?.photos || [];
        const newVideos = videoRes?.videos || [];

        if (currentPage === 1) {
          // ✅ FIX 3: Set images + videos in ONE state update batch to avoid blank flash
          setImages(newPhotos);
          setVideos(newVideos);
        } else {
          setImages((prev) => [...prev, ...newPhotos]);
          setVideos((prev) => [...prev, ...newVideos]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [sdk]
  );

  // ✅ FIX 4: Debounce resets page to 1 (no separate reset effect needed)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setPage(1); // triggers the fetch effect below with page=1
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // ✅ FIX 5: One single effect drives all fetching
  useEffect(() => {
    fetchData(debouncedQuery, page);
  }, [debouncedQuery, page]);

  // ✅ FIX 6: Observer uses ref for loading — never stale, never re-attaches on every load
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, []); // ✅ empty deps — attaches once, never re-registers

  const reelItems = videos.map((v: any) => ({
    id: v.id,
    videoUrl: v.videoUrl?.replace(/[[]]/g, ""),
  }));

  return (
    <div style={{ padding: 20 }}>
      <h2>Media SDK</h2>

      {/* SEARCH */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "12px 16px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)",
          border: "1px solid rgba(0,0,0,0.05)",
          transition: "all 0.25s ease",
        }}
      >
        <input
          type="text"
          placeholder="Search images & videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#111827",
            fontSize: "15px",
            fontWeight: 500,
            caretColor: "#6366f1",
            fontFamily: "inherit",
            letterSpacing: "0.2px",
          }}
        />
      </div>

      {loading && page === 1 && <p>Loading...</p>}

      {/* IMAGES */}
      <h3>Images</h3>
      <Grid
        items={images}
        renderItem={(photo: any) => (
          <img
            src={photo.src?.medium}
            loading="lazy"
            onClick={() => {
              const index = images.findIndex((p) => p.id === photo.id);
              setSelectedIndex(index);
            }}
            style={{ width: "100%", borderRadius: 10, cursor: "pointer" }}
          />
        )}
      />

      {/* LOAD MORE TRIGGER */}
      <div ref={loadMoreRef} style={{ height: 20 }} />
      {loading && page > 1 && (
        <p style={{ textAlign: "center", color: "#888" }}>Loading more...</p>
      )}

      {/* REELS */}
      <h3 style={{ marginTop: 40 }}>Reels</h3>
      {reelItems.length > 0 ? (
        <Reel items={reelItems} />
      ) : (
        <p>No videos available</p>
      )}

      {/* LIGHTBOX */}
      {selectedIndex !== null && (
        <Lightbox
          items={images.map((p: any) => ({
            id: p.id,
            imageUrl: p.src?.large,
          }))}
          selectedIndex={selectedIndex}
          isOpen={true}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </div>
  );
}

