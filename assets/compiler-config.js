/* GearEx compiler configuration — domain-scoped PUBLIC widget keys.
 * These OnlineCompiler.io Widgets/WebSocket keys are designed for browsers.
 * NEVER put a private REST API or Supabase service-role secret in this file.
 *
 * Keep the current GearEx editor: the same widget key works with the documented
 * Socket.IO WebSocket API. Loading widget.js would add a separate editor.
 *
 * OnlineCompiler.io allows one approved website per key. Do not swap domains:
 * Vercel uses its own widget, GitHub Pages keeps the original widget.
 */
(function(root){
 'use strict';
 const widgetKeys=Object.freeze({
  'https://gearex.vercel.app':'8249c2654adad1b10f4c6aa5cd453a61',
  'https://nittinchughani.github.io':'e334daaffea0b59dbc20e57ae34b2113'
 });
 const origin=root?.location?.origin||'';
 root.GearExCompilerConfig=Object.freeze({
  widgetKeys,
  widgetKey:Object.hasOwn(widgetKeys,origin)?widgetKeys[origin]:''
 });
})(window);
