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
  const loadingRef = useRef(false);

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

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    fetchData(debouncedQuery, page);
  }, [debouncedQuery, page]);

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
  }, []);

  // ✅ Track view event when lightbox opens
  const handleOpenLightbox = (index: number) => {
    setSelectedIndex(index);
    sdk.trackView(images[index]);
  };

  // ✅ Track download event when user downloads
  const handleDownload = (item: any) => {
    sdk.trackDownload(item);
  };

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
              handleOpenLightbox(index); // ✅ emits view event
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
    onDownload={handleDownload}

    renderOverlay={(props, children) => (
      <div
        {...props}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.9)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999,
        }}
      >
        {children}
      </div>
    )}

    renderImage={(props, item) => (
      <img
        {...props}
        src={item.imageUrl}
        alt=""
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: 12,
        }}
      />
    )}

    renderPrevButton={(props) => (
      <button
        {...props}
        style={{
          position: "absolute",
          left: 20,
          fontSize: 24,
          cursor: "pointer",
          padding: "8px 16px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fffd",
          borderRadius: 999,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >◀</button>
    )}

    renderNextButton={(props) => (
      <button
        {...props}
        style={{
          position: "absolute",
          right: 20,
          fontSize: 24,
          cursor: "pointer",
          padding: "8px 16px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fffd",
          borderRadius: 999,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >▶</button>
    )}

    renderCloseButton={(props) => (
      <button
        {...props}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          fontSize: 20,
          cursor: "pointer",
          padding: "8px 14px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fffd",
          borderRadius: 999,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >✕</button>
    )}

    renderDownloadButton={(props) => (
      <button
        {...props}
        style={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 16px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "#fffd",
          borderRadius: 999,
          fontSize: 14,
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        }}
      >Download</button>
    )}
  />
)}
    </div>
  );
}

