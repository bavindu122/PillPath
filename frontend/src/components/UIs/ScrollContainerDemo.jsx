import React from "react";
import ScrollContainer, {
  ModalScrollContainer,
  SidebarScrollContainer,
  ContentScrollContainer,
  HiddenScrollContainer,
} from "./ScrollContainer";

const ScrollContainerDemo = () => {
  // Sample content for demonstration
  const sampleContent = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      className="p-4 mb-2 bg-white/10 rounded-lg border border-white/20"
    >
      <h3 className="text-white font-semibold">Item {i + 1}</h3>
      <p className="text-white/70 text-sm">
        This is sample content item {i + 1}. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua.
      </p>
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          ScrollContainer Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default ScrollContainer */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Default Theme (Blue)
            </h2>
            <ScrollContainer
              className="p-4"
              maxHeight="300px"
              scrollbarTheme="default"
            >
              {sampleContent.slice(0, 10)}
            </ScrollContainer>
          </div>

          {/* Green ScrollContainer */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Green Theme
            </h2>
            <ScrollContainer
              className="p-4"
              maxHeight="300px"
              scrollbarTheme="green"
            >
              {sampleContent.slice(0, 10)}
            </ScrollContainer>
          </div>

          {/* Purple ScrollContainer */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Purple Theme
            </h2>
            <ScrollContainer
              className="p-4"
              maxHeight="300px"
              scrollbarTheme="purple"
            >
              {sampleContent.slice(0, 10)}
            </ScrollContainer>
          </div>

          {/* Custom Color ScrollContainer */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Custom Color (Orange)
            </h2>
            <ScrollContainer
              className="p-4"
              maxHeight="300px"
              scrollbarTheme="custom"
              customScrollbarColor="linear-gradient(90deg, #f97316 0%, #ea580c 100%)"
            >
              {sampleContent.slice(0, 10)}
            </ScrollContainer>
          </div>

          {/* Hidden Scrollbar */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Hidden Scrollbar
            </h2>
            <HiddenScrollContainer className="p-4" maxHeight="300px">
              {sampleContent.slice(0, 10)}
            </HiddenScrollContainer>
          </div>

          {/* Modal ScrollContainer */}
          <div className="bg-white/10 rounded-xl border border-white/20 p-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Modal Scroll Container
            </h2>
            <div className="h-80 bg-black/20 rounded-lg overflow-hidden">
              <ModalScrollContainer maxHeight="320px">
                {sampleContent.slice(0, 15)}
              </ModalScrollContainer>
            </div>
          </div>
        </div>

        {/* Large Content Demo */}
        <div className="mt-12 bg-white/10 rounded-xl border border-white/20 p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Content ScrollContainer - Large Content
          </h2>
          <ContentScrollContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleContent}
            </div>
          </ContentScrollContainer>
        </div>

        {/* API Documentation */}
        <div className="mt-12 bg-white/10 rounded-xl border border-white/20 p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">
            ScrollContainer API
          </h2>
          <ContentScrollContainer maxHeight="400px">
            <div className="text-white/80 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Props:</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      children
                    </code>{" "}
                    - React components to be rendered inside the scroll container
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      className
                    </code>{" "}
                    - Additional CSS classes (default: "")
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      maxHeight
                    </code>{" "}
                    - Maximum height of the container (default: "400px")
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      scrollbarTheme
                    </code>{" "}
                    - Theme for scrollbar: "default", "green", "blue", "purple",
                    "custom"
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      scrollbarWidth
                    </code>{" "}
                    - Width of the scrollbar (default: "8px")
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      customScrollbarColor
                    </code>{" "}
                    - Custom color for scrollbar when theme is "custom"
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      showScrollbar
                    </code>{" "}
                    - Whether to show scrollbar (default: true)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Predefined Variants:
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      ModalScrollContainer
                    </code>{" "}
                    - For modal dialogs with padding
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      SidebarScrollContainer
                    </code>{" "}
                    - For sidebar navigation with purple theme
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      ContentScrollContainer
                    </code>{" "}
                    - For main content areas with blue theme
                  </li>
                  <li>
                    <code className="bg-black/30 px-2 py-1 rounded">
                      HiddenScrollContainer
                    </code>{" "}
                    - For content with hidden scrollbars
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Usage Examples:
                </h3>
                <pre className="bg-black/30 p-4 rounded-lg text-xs overflow-x-auto">
                  {`// Basic usage
<ScrollContainer 
  maxHeight="400px" 
  scrollbarTheme="green"
>
  <YourContent />
</ScrollContainer>

// Modal usage
<ModalScrollContainer>
  <YourModalContent />
</ModalScrollContainer>

// Custom scrollbar
<ScrollContainer 
  scrollbarTheme="custom"
  customScrollbarColor="linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%)"
>
  <YourContent />
</ScrollContainer>`}
                </pre>
              </div>
            </div>
          </ContentScrollContainer>
        </div>
      </div>
    </div>
  );
};

export default ScrollContainerDemo;
