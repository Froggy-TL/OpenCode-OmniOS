package android.webkit;
import android.content.Context;
import android.view.View;
public class WebView extends View {
    public WebView(Context c) {}
    public WebSettings getSettings() { return null; }
    public void loadUrl(String u) {}
    public boolean canGoBack() { return false; }
    public void goBack() {}
    public void setWebViewClient(WebViewClient client) {}
}
