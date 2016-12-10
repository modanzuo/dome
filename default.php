<!doctype html>
<?php
include_once('const.php');
$debug = !empty($_GET['test']);
$scriptName = basename($_SERVER['SCRIPT_FILENAME']);
$pos = strpos($_SERVER['PHP_SELF'], '/' . $scriptName);
$baseUrl = 'http://' . $_SERVER['SERVER_NAME'] . substr($_SERVER['SCRIPT_NAME'], 0, $pos) . '/';
$apiUrl = 'http://' . $_SERVER['SERVER_NAME'] . '';
if ($_SERVER['SERVER_NAME'] == 'w.vapp.so' || $debug) $apiUrl = $apiUrl . '/corollarav4';
?>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="renderer" content="webkit">
    <meta name="format-detection" content="telephone=no"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
    <meta id="viewport" name="viewport" content="width=640px, user-scalable=no"/>
    <link rel="shortcut icon" type="image/x-icon"
          href="https://res.wx.qq.com/payactres/zh_CN/htmledition/images/favicon1d7e6c.ico"/>

    <?php if ($debug): ?>
        <script type="text/javascript" src="<?= $baseUrl; ?>public/lib/underscore-min.js"></script>
        <script type="text/javascript" src="<?= $baseUrl; ?>public/lib/imgloader.js"></script>
        <script type="text/javascript" src="<?= $baseUrl; ?>public/lib/adaptUILayout.js"></script>
        <script type="text/javascript" src="<?= $baseUrl; ?>public/lib/zepto.min.js"></script>
        <script type="text/javascript" src="<?= $baseUrl; ?>public/lib/touch.js"></script>
        <script type="text/javascript" src="<?= $baseUrl; ?>public/lib/music.js"></script>
        <script type="text/javascript" src="<?= $baseUrl; ?>public/js/main.js"></script>
    <link rel="stylesheet" type="text/css" href="<?= $baseUrl; ?>public/css/style.css?<?php echo time(); ?>"/>
    <?php else: ?>
        <script type="text/javascript" src="<?= $baseUrl; ?>public/build/main.<?php echo MAIN_VERSION; ?>.js"></script>
    <link rel="stylesheet" type="text/css" href="<?= $baseUrl; ?>public/build/style.<?php echo MAIN_VERSION; ?>.css"/>
    <?php endif; ?>

    <script type="text/javascript">
        adaptUILayout.load(640);
        window.baseUrl = "<?php echo $baseUrl; ?>";
        window.debug = <?php echo $debug?1:0; ?>;
        window.apiUrl = "<?php echo $apiUrl?>";
    </script>
    <title> </title>
</head>
<body>
<div class="loading">
    <div class="text">0%</div>
</div>
<div class="site-home site-common unload">
    <div class="container">
        <div class="up-btn"><i class="ani-fl2"></i></div>

        <div class="audio"></div>
        <div class="page-box">
            <div class="page-bg"></div>
            <div class="main">
                <section class="page-1" data-pageid="home">
                    <div class="screen screen-top">

                    </div>
                </section>
            </div>

        </div>

    </div>
</div>


<script type="text/javascript">

    $(function () {
        window.shareData = {
            "imgUrl": '<?php echo $baseUrl; ?>public/img/share.jpg',
            "link": window.location.href,
            "desc": "",
            "title": "",
            "success": function (res) {

            }
        };
    });
</script>

</body>
</html>
