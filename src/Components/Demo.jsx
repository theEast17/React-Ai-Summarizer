import { useEffect, useState } from "react";
import { useLazyGetSummaryQuery } from "../services/articleApi";
import { loader, copy, tick, linkIcon } from "../assets";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articleFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    if (articleFromLocalStorage) {
      setAllArticles(articleFromLocalStorage);
    }
  }, []);

  const copyUrl = (url) => {
    setCopied(url);
    navigator.clipboard.writeText(url);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await getSummary({ articleUrl: article.url });
      if (data?.summary) {
        const newArticle = { ...article, summary: data.summary };
        const updatedAllArticles = [newArticle, ...allArticles];
        setArticle(newArticle);
        setAllArticles(updatedAllArticles);
        localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      }
    } catch (error) {
      console.error("An error occurred while fetching summary:", error);
    }
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="linkIcon"
            className="absolute left-0 my-2 w-5 ml-3"
          />
          <input
            type="url"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn
                    peer-focus:border-gray-700
                    peer-focus:text-gray700
                    "
          >
            🔍
          </button>
        </form>
        {/* Browse URL History */}
        <div className="flex flex-col max-h-60 gap-1 overflow-y-auto">
          {allArticles.map((article, index) => {
            return (
              <div
                key={`link-${index}`}
                onClick={() => setArticle(article)}
                className="link_card"
              >
                <div className="copy_btn" onClick={() => copyUrl(article.url)}>
                  <img
                    src={copied === article.url ? tick : copy}
                    alt="copy_btn"
                    className="w-[40%] h-[40%] object-cover"
                  />
                </div>
                <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                  {article.url}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* display summary */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img
            src={loader}
            alt="loaderGif"
            className="w-20 h-20 object-cover"
          />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well that was not supposed to happen
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-700 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
